import React, { useState } from 'react';
import { 
  X, 
  Server, 
  Database, 
  Terminal, 
  FileCode, 
  ShieldCheck, 
  Activity, 
  Layers,
  Copy,
  Check
} from 'lucide-react';

interface InfrastructureDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfrastructureDocsModal: React.FC<InfrastructureDocsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'docker' | 'terraform' | 'django' | 'prometheus'>('docker');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dockerComposeCode = `# docker-compose.prod.yml
# Multi-container production architecture for Audrin Fire Engineers
version: '3.9'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "3000:3000"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./dist:/usr/share/nginx/html:ro
    depends_on:
      - web
    restart: always

  web:
    build:
      context: .
      dockerfile: Dockerfile
    command: gunicorn audrin_fire.wsgi:application --bind 0.0.0.0:8000 --workers 4
    environment:
      - DJANGO_SETTINGS_MODULE=audrin_fire.settings.production
      - DATABASE_URL=postgres://audrin_user:\${DB_PASSWORD}@postgres:5432/audrin_fire_db
      - REDIS_URL=redis://redis:6379/0
      - S3_BUCKET_NAME=audrin-fire-evidence-af-south-1
      - SANS_10139_COMPLIANCE_MODE=STRICT
    depends_on:
      - postgres
      - redis
    restart: always

  celery_worker:
    build: .
    command: celery -A audrin_fire worker -l INFO -c 4 -Q default,reports,google_sync
    environment:
      - DJANGO_SETTINGS_MODULE=audrin_fire.settings.production
      - DATABASE_URL=postgres://audrin_user:\${DB_PASSWORD}@postgres:5432/audrin_fire_db
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - redis
      - postgres
    restart: always

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: audrin_fire_db
      POSTGRES_USER: audrin_user
      POSTGRES_PASSWORD: \${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  redis:
    image: redis:7-alpine
    restart: always

volumes:
  postgres_data:`;

  const terraformCode = `# main.tf - AWS Infrastructure as Code for AUDRIN FIRE ENGINEERS
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "af-south-1" # AWS Cape Town Region
  default_tags {
    tags = {
      Project     = "AudrinFireEngineers"
      Standard    = "SANS-10139"
      Environment = "Production"
    }
  }
}

# KMS Encrypted S3 Bucket for Audited Photographic & Video Evidence
resource "aws_s3_bucket" "evidence_storage" {
  bucket = "audrin-fire-evidence-af-south-1"
}

resource "aws_s3_bucket_server_side_encryption_configuration" "evidence_kms" {
  bucket = aws_s3_bucket.evidence_storage.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
  }
}

# ECS Fargate Cluster
resource "aws_ecs_cluster" "main" {
  name = "audrin-fire-cluster"
}

# RDS PostgreSQL 16 Multi-AZ
resource "aws_db_instance" "postgres" {
  identifier        = "audrin-fire-postgres-prod"
  engine            = "postgres"
  engine_version    = "16.1"
  instance_class    = "db.t4g.medium"
  allocated_storage = 50
  multi_az          = true
  storage_encrypted = true
  skip_final_snapshot = false
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0B]/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-[#151518] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0A0A0B] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C1A461]/10 border border-[#C1A461]/30 flex items-center justify-center text-[#C1A461]">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                AUDRIN FIRE — Backend Architecture & Infrastructure Docs
              </h3>
              <p className="text-[11px] text-white/50 font-mono">
                AWS ECS Fargate, Django Celery Worker, PostgreSQL, KMS S3 & Terraform IaC
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/5 bg-[#0A0A0B]">
          <button
            onClick={() => setActiveTab('docker')}
            className={`px-4 py-2 rounded-t-xl text-xs font-semibold border-b-2 transition ${
              activeTab === 'docker' ? 'text-[#C1A461] border-[#C1A461] bg-[#151518]' : 'text-white/40 border-transparent hover:text-white'
            }`}
          >
            Docker Compose
          </button>
          <button
            onClick={() => setActiveTab('terraform')}
            className={`px-4 py-2 rounded-t-xl text-xs font-semibold border-b-2 transition ${
              activeTab === 'terraform' ? 'text-[#C1A461] border-[#C1A461] bg-[#151518]' : 'text-white/40 border-transparent hover:text-white'
            }`}
          >
            Terraform IaC (AWS)
          </button>
        </div>

        {/* Code Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#0A0A0B] font-mono text-xs text-white/80 relative">
          <div className="absolute top-6 right-6">
            <button
              onClick={() => copyCode(activeTab === 'docker' ? dockerComposeCode : terraformCode)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#151518] hover:bg-white/10 text-white rounded-lg text-xs font-sans border border-white/10 transition shadow"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#C1A461]" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="leading-relaxed overflow-x-auto text-white/80">
            {activeTab === 'docker' ? dockerComposeCode : terraformCode}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0A0A0B] border-t border-white/5 flex items-center justify-between text-xs text-white/50">
          <span>Target Standard: SANS 10139 Continuous Auditing Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#151518] hover:bg-white/10 text-white rounded-xl text-xs font-semibold border border-white/10 transition"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
