
# ExpertsCloud

<img width="200px" src="public/logo.png" />
ExpertsCloud provides DevOps services for companies of all sizes. We ensure end-to-end software delivery automation, as well as security of infrastructure in the company.

Follow us on social media:

<a href="https://www.facebook.com/Expertscloud" target="_blank"><img src="public/facebook.png" alt="Facebook" width="30" height="30"></a>
<a href="https://www.linkedin.com/company/expertscloud-pvt-limited" target="_blank"><img src="public/linkedin.png" alt="LinkedIn" width="30" height="30"></a>
<a href="https://www.instagram.com/lifeatexpertscloud/" target="_blank"><img src="public/instagram.png" alt="Instagram" width="30" height="30"></a>



# Lambda-Serverless-Html-To-PDF

## Description
The htmlToPDF function converts HTML content into PDF format and stores it in an Amazon S3 bucket.


## Features
- Input Flexibility: Accepts an S3 key or base64-encoded HTML string as input.
- Validation: Uses htmlToPDFValidator to ensure input data is correct.
- Conversion: Converts HTML content to PDF using the htmlToPDF utility.
- Storage: Uploads the resulting PDF to a specified S3 bucket.
- Response: Returns a success response with the URL of the new PDF or an error message.



## Getting Started

These instructions will help you set up and deploy the project on your local machine and in the cloud.

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [Serverless Framework](https://www.serverless.com/) installed
- npm (Node Package Manager) installed
- AWS account and AWS CLI configured (if deploying to AWS)
- Ensure that an S3 bucket is  created.

### Configure AWS CLI
```bash
aws configure
```
It will prompt you to enter the following information:

 - AWS Access Key ID: Your AWS access key.
 - AWS Secret Access Key: Your AWS secret key.
 - Default region name: The AWS region you want to use (e.g., us-east-1).

 ### IAM Role:
Create an IAM role with permissions to access S3 buckets, Lambda functions, API Gateway, and CloudWatch.

### Installation

1. Clone the repository:

```bash
git git@github.com:expertscloud/lambda-serverless-html-to-pdf.git
cd lambda-serverless-html-to-pdf
```

2. Install dependencies:
```bash
npm i
```
3. Configuration:
   Update 'serverless.yml' with your config:
   ```bash
   frameworkVersion: "your version"
    provider:
      name: aws
      runtime: your nodejs verison e.g nodejs20.x
      region: your region e.g us-east-1
      role: your aws role e.g arn:aws:iam::123:role/serverless-role
      ```

4. Deployment:
   ```bash
   sls deploy
   ```
