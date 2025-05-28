# File Uploader

A modern web application built with Next.js that provides a user-friendly interface for uploading files to AWS S3 using presigned URLs. This application is perfect for handling large file uploads (several GB in size) directly to S3 buckets.

## Features

- Drag and drop file upload interface
- Progress tracking for uploads
- Support for large file uploads
- Modern UI with Tailwind CSS
- Responsive design
- Error handling and validation
- Upload status feedback

## Prerequisites

- Node.js 18.x or later
- npm (Node Package Manager)
- An AWS S3 bucket with appropriate CORS configuration
- Presigned URLs for file uploads
- GitHub account (for deployment)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd file-uploader
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Obtain a presigned URL from your AWS S3 bucket (this needs to be generated server-side)
2. Enter the presigned URL in the input field
3. Either drag and drop a file or click to select a file
4. Click the "Upload File" button to start the upload
5. Monitor the upload progress
6. Once complete, you'll see a success message

## Building for Production

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## Deploying to GitHub Pages

1. First, add the following to your `package.json`:
```json
{
  "homepage": "https://<your-github-username>.github.io/file-uploader",
  "scripts": {
    "export": "next build && next export",
    "deploy": "npm run export && touch out/.nojekyll && gh-pages -d out -t true"
  }
}
```

2. Install the required deployment dependencies:
```bash
npm install --save-dev gh-pages
```

3. Create a GitHub repository if you haven't already:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-github-username>/file-uploader.git
git push -u origin main
```

4. Configure GitHub Pages:
   - Go to your repository on GitHub
   - Click on "Settings"
   - Scroll down to "GitHub Pages" section
   - Under "Source", select "gh-pages" branch
   - Click "Save"

5. Deploy your application:
```bash
npm run deploy
```

6. Your application will be available at: `https://<your-github-username>.github.io/file-uploader`

Note: After deployment, it might take a few minutes for your site to be available.

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Radix UI Components
- npm package manager

## License

MIT 