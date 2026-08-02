import { prisma } from "../config/db.js";

//adding new case to db
export const createCase = async (req, res) => {
  try {
    const {
      caseNumber,
      title,
      description,
      dateReported,
      dateOfOccurrence,
      status,
      stationId,
    } = req.body;

    const station = await prisma.station.findUnique({
      where: { id: stationId },
    });

    if (!station) {
      return res.status(404).json({
        success: false,
        message: "Station not found.",
      });
    }

    const existingCase = await prisma.case.findUnique({
      where: { caseNumber },
    });

    if (existingCase) {
      return res.status(409).json({
        success: false,
        message: "Case number already exists.",
      });
    }

    const newCase = await prisma.case.create({
      data: {
        caseNumber,
        title,
        description,
        dateReported: new Date(dateReported),
        dateOfOccurrence: dateOfOccurrence
          ? new Date(dateOfOccurrence)
          : null,
        status,
        stationId,
      },
      include: {
        station: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Case created successfully.",
      data: newCase,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create case.",
    });
  }
};

//fetching all cases
export const getCases = async (req, res) => {
  try {
    const cases = await prisma.case.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        station: true,
        criminalCases: {
          include: {
            criminal: true,
            crime: true,
          },
        },
        evidence: {
          include: {
            officerLog: true,
          },
        },
        arrests: {
          include: {
            criminal: true,
            officer: true,
          },
        },
        courtCases: {
          include: {
            sentences: true,
          },
        },
        victims: true,
        witnesses: true,
      },
    });

    return res.status(200).json({
      success: true,
      count: cases.length,
      data: cases,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve cases.",
    });
  }
};

//fetching case with id
export const getCaseById = async (req, res) => {
  try {
    const { id } = req.params;

    const caseRecord = await prisma.case.findUnique({
      where: { id },
      include: {
        station: true,
        criminalCases: {
          include: {
            criminal: true,
            crime: true,
          },
        },
        evidence: {
          include: {
            officerLog: true,
          },
        },
        arrests: {
          include: {
            criminal: true,
            officer: true,
          },
        },
        courtCases: {
          include: {
            sentences: {
              include: {
                criminal: true,
              },
            },
          },
        },
        victims: true,
        witnesses: true,
      },
    });

    if (!caseRecord) {
      return res.status(404).json({
        success: false,
        message: "Case not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: caseRecord,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve case.",
    });
  }
};

//updating cases
export const updateCase = async (req, res) => {
  try {
    const { id } = req.params;

    const existingCase = await prisma.case.findUnique({
      where: { id },
    });

    if (!existingCase) {
      return res.status(404).json({
        success: false,
        message: "Case not found.",
      });
    }

    const {
      caseNumber,
      title,
      description,
      dateReported,
      dateOfOccurrence,
      status,
      stationId,
    } = req.body;

    if (stationId) {
      const station = await prisma.station.findUnique({
        where: {
          id: stationId,
        },
      });

      if (!station) {
        return res.status(404).json({
          success: false,
          message: "Station not found.",
        });
      }
    }

    if (caseNumber && caseNumber !== existingCase.caseNumber) {
      const duplicate = await prisma.case.findUnique({
        where: { caseNumber },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Case number already exists.",
        });
      }
    }

    const updatedCase = await prisma.case.update({
      where: { id },
      data: {
        caseNumber,
        title,
        description,
        dateReported: dateReported
          ? new Date(dateReported)
          : undefined,
        dateOfOccurrence:
          dateOfOccurrence !== undefined
            ? dateOfOccurrence
              ? new Date(dateOfOccurrence)
              : null
            : undefined,
        status,
        stationId,
      },
      include: {
        station: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Case updated successfully.",
      data: updatedCase,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update case.",
    });
  }
};