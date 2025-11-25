FROM python:3.12-slim

# Working directory inside container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y build-essential libpq-dev

# Copy requirements
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy Django project code
COPY . .

# Expose port
EXPOSE 8000

# Run migrations and start Gunicorn
CMD ["bash", "-c", "python manage.py migrate && gunicorn your_project.wsgi:application --bind 0.0.0.0:8000"]
