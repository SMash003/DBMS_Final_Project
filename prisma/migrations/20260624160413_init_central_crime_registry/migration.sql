-- CreateEnum
CREATE TYPE "CaseStatusType" AS ENUM ('OPEN', 'UNDER_INVESTIGATION', 'CLOSED', 'COLD');

-- CreateEnum
CREATE TYPE "RankLevel" AS ENUM ('CONSTABLE', 'NAIK', 'ASI', 'SERGEANT', 'SI', 'INSPECTOR', 'ASP', 'ADDITIONAL_SP', 'SP', 'ADDITIONAL_DIG', 'DIG', 'ADDITIONAL_IGP', 'IGP');

-- CreateEnum
CREATE TYPE "OfficerDesignation" AS ENUM ('OC', 'INVESTIGATION_OFFICER', 'DUTY_OFFICER', 'CIRCLE_OFFICER', 'SDPO', 'COMMANDANT', 'COMMISSIONER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "VerdictType" AS ENUM ('PENDING', 'GUILTY', 'ACQUITTED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "SentenceType" AS ENUM ('INCARCERATION', 'PROBATION', 'RESTITUTION', 'COMMUNITY_SERVICE', 'FINE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'OFFICER');

-- CreateTable
CREATE TABLE "criminals" (
    "id" UUID NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "gender" "Gender" NOT NULL,
    "aliases" TEXT,
    "address" TEXT,
    "identification_no" VARCHAR(17) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "criminals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cases" (
    "id" UUID NOT NULL,
    "case_number" VARCHAR(20) NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "date_reported" TIMESTAMP(3) NOT NULL,
    "date_of_occurrence" TIMESTAMP(3),
    "status" "CaseStatusType" NOT NULL DEFAULT 'OPEN',
    "station_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crimes" (
    "id" UUID NOT NULL,
    "crime_type" VARCHAR(100) NOT NULL,
    "severity_level" VARCHAR(50) NOT NULL,
    "legal_code_ref" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crimes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "criminal_case" (
    "id" UUID NOT NULL,
    "criminal_id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "crime_id" UUID NOT NULL,
    "role_in_crime" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "criminal_case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "officers" (
    "id" UUID NOT NULL,
    "badge_number" VARCHAR(20) NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "gender" "Gender" NOT NULL,
    "rank_level" "RankLevel" NOT NULL,
    "designation" "OfficerDesignation",
    "contact_number" VARCHAR(20),
    "station_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "officers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stations" (
    "id" UUID NOT NULL,
    "station_name" VARCHAR(100) NOT NULL,
    "location_address" TEXT NOT NULL,
    "jurisdiction_area" VARCHAR(150),
    "contact_number" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence" (
    "id" UUID NOT NULL,
    "evidence_code" VARCHAR(30) NOT NULL,
    "description" TEXT NOT NULL,
    "date_collected" TIMESTAMP(3) NOT NULL,
    "storage_location" VARCHAR(100),
    "case_id" UUID NOT NULL,
    "collected_by_officer_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arrests" (
    "id" UUID NOT NULL,
    "arrest_date_time" TIMESTAMP(3) NOT NULL,
    "arrest_location" TEXT,
    "criminal_id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "officer_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "arrests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "court_cases" (
    "id" UUID NOT NULL,
    "court_name" VARCHAR(150) NOT NULL,
    "judge_name" VARCHAR(100),
    "hearing_date" TIMESTAMP(3),
    "verdict" "VerdictType" NOT NULL DEFAULT 'PENDING',
    "case_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "court_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sentences" (
    "id" UUID NOT NULL,
    "sentence_type" "SentenceType" NOT NULL,
    "duration_months" INTEGER,
    "fine_amount" DECIMAL(15,2),
    "start_date" DATE,
    "court_case_id" UUID NOT NULL,
    "criminal_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sentences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "victims" (
    "id" UUID NOT NULL,
    "first_name" VARCHAR(50),
    "last_name" VARCHAR(50),
    "gender" "Gender" NOT NULL,
    "contact_info" TEXT,
    "statement" TEXT,
    "case_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "victims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "witnesses" (
    "id" UUID NOT NULL,
    "first_name" VARCHAR(50),
    "last_name" VARCHAR(50),
    "gender" "Gender" NOT NULL,
    "contact_info" TEXT,
    "statement_summary" TEXT,
    "protection_status" BOOLEAN NOT NULL DEFAULT false,
    "case_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "witnesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "email" VARCHAR(100),
    "role" "UserRole" NOT NULL,
    "officer_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "criminals_identification_no_key" ON "criminals"("identification_no");

-- CreateIndex
CREATE INDEX "criminals_last_name_idx" ON "criminals"("last_name");

-- CreateIndex
CREATE INDEX "criminals_identification_no_idx" ON "criminals"("identification_no");

-- CreateIndex
CREATE UNIQUE INDEX "cases_case_number_key" ON "cases"("case_number");

-- CreateIndex
CREATE INDEX "cases_case_number_idx" ON "cases"("case_number");

-- CreateIndex
CREATE INDEX "cases_station_id_idx" ON "cases"("station_id");

-- CreateIndex
CREATE UNIQUE INDEX "crimes_crime_type_key" ON "crimes"("crime_type");

-- CreateIndex
CREATE INDEX "criminal_case_criminal_id_idx" ON "criminal_case"("criminal_id");

-- CreateIndex
CREATE INDEX "criminal_case_case_id_idx" ON "criminal_case"("case_id");

-- CreateIndex
CREATE INDEX "criminal_case_crime_id_idx" ON "criminal_case"("crime_id");

-- CreateIndex
CREATE UNIQUE INDEX "criminal_case_criminal_id_case_id_crime_id_key" ON "criminal_case"("criminal_id", "case_id", "crime_id");

-- CreateIndex
CREATE UNIQUE INDEX "officers_badge_number_key" ON "officers"("badge_number");

-- CreateIndex
CREATE INDEX "officers_station_id_idx" ON "officers"("station_id");

-- CreateIndex
CREATE UNIQUE INDEX "evidence_evidence_code_key" ON "evidence"("evidence_code");

-- CreateIndex
CREATE INDEX "evidence_case_id_idx" ON "evidence"("case_id");

-- CreateIndex
CREATE INDEX "evidence_collected_by_officer_id_idx" ON "evidence"("collected_by_officer_id");

-- CreateIndex
CREATE INDEX "arrests_criminal_id_idx" ON "arrests"("criminal_id");

-- CreateIndex
CREATE INDEX "arrests_case_id_idx" ON "arrests"("case_id");

-- CreateIndex
CREATE INDEX "arrests_officer_id_idx" ON "arrests"("officer_id");

-- CreateIndex
CREATE INDEX "court_cases_case_id_idx" ON "court_cases"("case_id");

-- CreateIndex
CREATE INDEX "sentences_court_case_id_idx" ON "sentences"("court_case_id");

-- CreateIndex
CREATE INDEX "sentences_criminal_id_idx" ON "sentences"("criminal_id");

-- CreateIndex
CREATE INDEX "victims_case_id_idx" ON "victims"("case_id");

-- CreateIndex
CREATE INDEX "witnesses_case_id_idx" ON "witnesses"("case_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_officer_id_key" ON "users"("officer_id");

-- CreateIndex
CREATE INDEX "users_officer_id_idx" ON "users"("officer_id");

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "stations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "criminal_case" ADD CONSTRAINT "criminal_case_criminal_id_fkey" FOREIGN KEY ("criminal_id") REFERENCES "criminals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "criminal_case" ADD CONSTRAINT "criminal_case_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "criminal_case" ADD CONSTRAINT "criminal_case_crime_id_fkey" FOREIGN KEY ("crime_id") REFERENCES "crimes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "officers" ADD CONSTRAINT "officers_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "stations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_collected_by_officer_id_fkey" FOREIGN KEY ("collected_by_officer_id") REFERENCES "officers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arrests" ADD CONSTRAINT "arrests_criminal_id_fkey" FOREIGN KEY ("criminal_id") REFERENCES "criminals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arrests" ADD CONSTRAINT "arrests_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arrests" ADD CONSTRAINT "arrests_officer_id_fkey" FOREIGN KEY ("officer_id") REFERENCES "officers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "court_cases" ADD CONSTRAINT "court_cases_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sentences" ADD CONSTRAINT "sentences_court_case_id_fkey" FOREIGN KEY ("court_case_id") REFERENCES "court_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sentences" ADD CONSTRAINT "sentences_criminal_id_fkey" FOREIGN KEY ("criminal_id") REFERENCES "criminals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "victims" ADD CONSTRAINT "victims_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "witnesses" ADD CONSTRAINT "witnesses_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_officer_id_fkey" FOREIGN KEY ("officer_id") REFERENCES "officers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
