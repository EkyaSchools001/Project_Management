module.exports = {
  apps: [
    {
      name: "node-backend",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
      }
    },
    {
      name: "python-ai-service",
      script: "ai_service/venv/Scripts/uvicorn.exe",
      args: "main:app --host 0.0.0.0 --port 8001",
      cwd: "ai_service",
      interpreter: "none",
      env: {
        PYTHONUNBUFFERED: "1"
      }
    }
  ]
};
