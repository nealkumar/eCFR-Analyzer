#!/bin/bash

# Set variables
AWS_REGION="us-east-1"
EB_APP_NAME="ecfr-analyzer"
EB_ENV_NAME="ecfr-analyzer-prod"
S3_BUCKET="ecfr-analyzer-frontend"
CLOUDFRONT_DISTRIBUTION_ID=""  # Fill in after creation

# Check for AWS CLI
if ! command -v aws &> /dev/null; then
    echo "AWS CLI not found, please install it."
    exit 1
fi

# Check for EB CLI
if ! command -v eb &> /dev/null; then
    echo "EB CLI not found, please install it."
    exit 1
fi

# Build the backend
echo "Building backend..."
cd src
mvn clean package -DskipTests
if [ $? -ne 0 ]; then
    echo "Backend build failed"
    exit 1
fi
cd ..

# Initialize Elastic Beanstalk application (if not already done)
cd src
if [ ! -f .elasticbeanstalk/config.yml ]; then
    eb init $EB_APP_NAME --region $AWS_REGION --platform "Java 17 running on 64bit Amazon Linux 2"
fi

# Deploy to Elastic Beanstalk
echo "Deploying backend to Elastic Beanstalk..."
eb use $EB_ENV_NAME || eb create $EB_ENV_NAME --single
if [ $? -ne 0 ]; then
    echo "Backend deployment failed"
    exit 1
fi

# Get the Elastic Beanstalk URL
EB_URL=$(eb status | grep "CNAME" | awk '{print $2}')
cd ..

# Build the frontend with the correct API endpoint
echo "Building frontend with API endpoint: $EB_URL"
cd frontend
echo "REACT_APP_API_BASE_URL=http://$EB_URL/ecfr-analyzer" > .env.production
npm install
npm run build
if [ $? -ne 0 ]; then
    echo "Frontend build failed"
    exit 1
fi

# Create S3 bucket if it doesn't exist
aws s3 mb s3://$S3_BUCKET --region $AWS_REGION || true

# Configure S3 bucket for static website hosting
aws s3 website s3://$S3_BUCKET --index-document index.html --error-document index.html

# Upload the frontend build to S3
echo "Uploading frontend to S3..."
aws s3 sync build/ s3://$S3_BUCKET --delete

# Create bucket policy for public access
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$S3_BUCKET/*"
    }
  ]
}
EOF

# Apply policy
aws s3api put-bucket-policy --bucket $S3_BUCKET --policy file://bucket-policy.json

# Create or update CloudFront distribution
if [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo "CloudFront distribution ID not set. Please create a CloudFront distribution manually."
    echo "Then, set CLOUDFRONT_DISTRIBUTION_ID in this script and run it again to enable client-side routing."
else
    # Create CloudFront configuration for client-side routing
    cat > cloudfront-config.json << EOF
    {
      "CustomErrorResponses": {
        "Quantity": 1,
        "Items": [
          {
            "ErrorCode": 404,
            "ResponsePagePath": "/index.html",
            "ResponseCode": "200",
            "ErrorCachingMinTTL": 300
          }
        ]
      }
    }
EOF

    # Update CloudFront distribution
    echo "Updating CloudFront distribution..."
    aws cloudfront update-distribution --id $CLOUDFRONT_DISTRIBUTION_ID --distribution-config file://cloudfront-config.json

    # Invalidate CloudFront cache
    aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
fi

echo "Deployment completed successfully!"
echo "Backend URL: http://$EB_URL/ecfr-analyzer"
echo "Frontend S3 URL: http://$S3_BUCKET.s3-website-$AWS_REGION.amazonaws.com"
if [ ! -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution --id $CLOUDFRONT_DISTRIBUTION_ID --query "Distribution.DomainName" --output text)
    echo "CloudFront URL: https://$CLOUDFRONT_DOMAIN"
fi

echo "Note: It may take a few minutes for changes to propagate."