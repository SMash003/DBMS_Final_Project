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
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'OFFICER', 'CLERK');

-- CreateTable
CREATE TABLE "Criminal" (
    "id" UUID NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "dateOfBirth" DATE NOT NULL,
    "gender" "Gender" NOT NULL,
    "aliases" TEXT,
    "address" TEXT,
    "nidNumber" VARCHAR(17) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Criminal_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Criminal"
ADD CONSTRAINT criminal_nid_check
CHECK ("nidNumber" ~ '^([0-9]{10}|[0-9]{17})$');
-- CreateTable
CREATE TABLE "Station" (
    "id" UUID NOT NULL,
    "stationName" VARCHAR(100) NOT NULL,
    "locationAddress" TEXT NOT NULL,
    "jurisdictionArea" VARCHAR(150),
    "contactNumber" VARCHAR(20),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Officer" (
    "id" UUID NOT NULL,
    "badgeNumber" VARCHAR(20) NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "gender" "Gender" NOT NULL,
    "rankLevel" "RankLevel" NOT NULL,
    "contactNumber" VARCHAR(20),
    "stationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Officer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Case" (
    "id" UUID NOT NULL,
    "caseNumber" VARCHAR(20) NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "dateReported" TIMESTAMP(3) NOT NULL,
    "dateOfOccurrence" TIMESTAMP(3),
    "status" "CaseStatusType" NOT NULL DEFAULT 'OPEN',
    "stationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Crime" (
    "id" UUID NOT NULL,
    "crimeType" VARCHAR(100) NOT NULL,
    "severityLevel" VARCHAR(50) NOT NULL,
    "legalCodeRef" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Crime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CriminalCase" (
    "id" UUID NOT NULL,
    "criminalId" UUID NOT NULL,
    "caseId" UUID NOT NULL,
    "crimeId" UUID NOT NULL,
    "roleInCrime" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CriminalCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" UUID NOT NULL,
    "evidenceCode" VARCHAR(30) NOT NULL,
    "description" TEXT NOT NULL,
    "dateCollected" TIMESTAMP(3) NOT NULL,
    "storageLocation" VARCHAR(100),
    "caseId" UUID NOT NULL,
    "collectedByOfficerId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Arrest" (
    "id" UUID NOT NULL,
    "arrestDateTime" TIMESTAMP(3) NOT NULL,
    "arrestLocation" TEXT,
    "criminalId" UUID NOT NULL,
    "caseId" UUID NOT NULL,
    "officerId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Arrest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourtCase" (
    "id" UUID NOT NULL,
    "courtName" VARCHAR(150) NOT NULL,
    "judgeName" VARCHAR(100),
    "hearingDate" TIMESTAMP(3),
    "verdict" "VerdictType" NOT NULL DEFAULT 'PENDING',
    "caseId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourtCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sentence" (
    "id" UUID NOT NULL,
    "sentenceType" "SentenceType" NOT NULL,
    "durationMonths" INTEGER,
    "fineAmount" DECIMAL(15,2),
    "startDate" DATE,
    "courtCaseId" UUID NOT NULL,
    "criminalId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sentence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Victim" (
    "id" UUID NOT NULL,
    "firstName" VARCHAR(50),
    "lastName" VARCHAR(50),
    "gender" "Gender" NOT NULL,
    "contactInfo" TEXT,
    "statement" TEXT,
    "caseId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Victim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Witness" (
    "id" UUID NOT NULL,
    "firstName" VARCHAR(50),
    "lastName" VARCHAR(50),
    "gender" "Gender" NOT NULL,
    "contactInfo" TEXT,
    "statementSummary" TEXT,
    "protectionStatus" BOOLEAN NOT NULL DEFAULT false,
    "caseId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Witness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "email" VARCHAR(100),
    "role" "UserRole" NOT NULL,
    "officerId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Criminal_nidNumber_key" ON "Criminal"("nidNumber");

-- CreateIndex
CREATE INDEX "Criminal_lastName_idx" ON "Criminal"("lastName");

-- CreateIndex
CREATE INDEX "Criminal_nidNumber_idx" ON "Criminal"("nidNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Officer_badgeNumber_key" ON "Officer"("badgeNumber");

-- CreateIndex
CREATE INDEX "Officer_stationId_idx" ON "Officer"("stationId");

-- CreateIndex
CREATE UNIQUE INDEX "Case_caseNumber_key" ON "Case"("caseNumber");

-- CreateIndex
CREATE INDEX "Case_caseNumber_idx" ON "Case"("caseNumber");

-- CreateIndex
CREATE INDEX "Case_stationId_idx" ON "Case"("stationId");

-- CreateIndex
CREATE UNIQUE INDEX "Crime_crimeType_key" ON "Crime"("crimeType");

-- CreateIndex
CREATE INDEX "CriminalCase_criminalId_idx" ON "CriminalCase"("criminalId");

-- CreateIndex
CREATE INDEX "CriminalCase_caseId_idx" ON "CriminalCase"("caseId");

-- CreateIndex
CREATE INDEX "CriminalCase_crimeId_idx" ON "CriminalCase"("crimeId");

-- CreateIndex
CREATE UNIQUE INDEX "CriminalCase_criminalId_caseId_crimeId_key" ON "CriminalCase"("criminalId", "caseId", "crimeId");

-- CreateIndex
CREATE UNIQUE INDEX "Evidence_evidenceCode_key" ON "Evidence"("evidenceCode");

-- CreateIndex
CREATE INDEX "Evidence_caseId_idx" ON "Evidence"("caseId");

-- CreateIndex
CREATE INDEX "Evidence_collectedByOfficerId_idx" ON "Evidence"("collectedByOfficerId");

-- CreateIndex
CREATE INDEX "Arrest_criminalId_idx" ON "Arrest"("criminalId");

-- CreateIndex
CREATE INDEX "Arrest_caseId_idx" ON "Arrest"("caseId");

-- CreateIndex
CREATE INDEX "Arrest_officerId_idx" ON "Arrest"("officerId");

-- CreateIndex
CREATE INDEX "CourtCase_caseId_idx" ON "CourtCase"("caseId");

-- CreateIndex
CREATE INDEX "Sentence_courtCaseId_idx" ON "Sentence"("courtCaseId");

-- CreateIndex
CREATE INDEX "Sentence_criminalId_idx" ON "Sentence"("criminalId");

-- CreateIndex
CREATE INDEX "Victim_caseId_idx" ON "Victim"("caseId");

-- CreateIndex
CREATE INDEX "Witness_caseId_idx" ON "Witness"("caseId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_officerId_key" ON "User"("officerId");

-- CreateIndex
CREATE INDEX "User_officerId_idx" ON "User"("officerId");

-- AddForeignKey
ALTER TABLE "Officer" ADD CONSTRAINT "Officer_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CriminalCase" ADD CONSTRAINT "CriminalCase_criminalId_fkey" FOREIGN KEY ("criminalId") REFERENCES "Criminal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CriminalCase" ADD CONSTRAINT "CriminalCase_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CriminalCase" ADD CONSTRAINT "CriminalCase_crimeId_fkey" FOREIGN KEY ("crimeId") REFERENCES "Crime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_collectedByOfficerId_fkey" FOREIGN KEY ("collectedByOfficerId") REFERENCES "Officer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arrest" ADD CONSTRAINT "Arrest_criminalId_fkey" FOREIGN KEY ("criminalId") REFERENCES "Criminal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arrest" ADD CONSTRAINT "Arrest_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arrest" ADD CONSTRAINT "Arrest_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "Officer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourtCase" ADD CONSTRAINT "CourtCase_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sentence" ADD CONSTRAINT "Sentence_courtCaseId_fkey" FOREIGN KEY ("courtCaseId") REFERENCES "CourtCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sentence" ADD CONSTRAINT "Sentence_criminalId_fkey" FOREIGN KEY ("criminalId") REFERENCES "Criminal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Victim" ADD CONSTRAINT "Victim_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Witness" ADD CONSTRAINT "Witness_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "Officer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
