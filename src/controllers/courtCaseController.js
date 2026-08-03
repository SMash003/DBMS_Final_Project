import { prisma } from "../config/db.js";

export const createCourtCase = async (req, res) => {
  try {
    const {
      courtName,
      judgeName,
      hearingDate,
      verdict,
      caseId,
    } = req.body;

    const caseRecord = await prisma.case.findUnique({
      where: {
        id: caseId,
      },
    });

    if (!caseRecord) {
      return res.status(404).json({
        success: false,
        message: "Case not found.",
      });
    }

    const courtCase = await prisma.courtCase.create({
      data: {
        courtName,
        judgeName,
        hearingDate: hearingDate ? new Date(hearingDate) : null,
        verdict,
        caseId,
      },
      include: {
        case: {
          include: {
            station: true,
          },
        },
        sentences: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Court case created successfully.",
      data: courtCase,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create court case.",
    });
  }
};

export const getCourtCases = async (req, res) => {
  try {
    const courtCases = await prisma.courtCase.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        case: {
          include: {
            station: true,
            criminalCases: {
              include: {
                criminal: true,
                crime: true,
              },
            },
            victims: true,
            witnesses: true,
          },
        },
        sentences: {
          include: {
            criminal: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      count: courtCases.length,
      data: courtCases,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve court cases.",
    });
  }
};

export const getCourtCaseById = async (req, res) => {
  try {
    const { id } = req.params;

    const courtCase = await prisma.courtCase.findUnique({
      where: {
        id,
      },
      include: {
        case: {
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
            victims: true,
            witnesses: true,
          },
        },
        sentences: {
          include: {
            criminal: true,
          },
        },
      },
    });

    if (!courtCase) {
      return res.status(404).json({
        success: false,
        message: "Court case not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: courtCase,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve court case.",
    });
  }
};

export const updateCourtCase = async (req, res) => {
  try {
    const { id } = req.params;

    const existingCourtCase = await prisma.courtCase.findUnique({
      where: {
        id,
      },
    });

    if (!existingCourtCase) {
      return res.status(404).json({
        success: false,
        message: "Court case not found.",
      });
    }

    const {
      courtName,
      judgeName,
      hearingDate,
      verdict,
      caseId,
    } = req.body;

    if (caseId) {
      const caseRecord = await prisma.case.findUnique({
        where: {
          id: caseId,
        },
      });

      if (!caseRecord) {
        return res.status(404).json({
          success: false,
          message: "Case not found.",
        });
      }
    }

    const updatedCourtCase = await prisma.courtCase.update({
      where: {
        id,
      },
      data: {
        courtName,
        judgeName,
        hearingDate:
          hearingDate !== undefined
            ? hearingDate
              ? new Date(hearingDate)
              : null
            : undefined,
        verdict,
        caseId,
      },
      include: {
        case: {
          include: {
            station: true,
          },
        },
        sentences: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Court case updated successfully.",
      data: updatedCourtCase,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update court case.",
    });
  }
};