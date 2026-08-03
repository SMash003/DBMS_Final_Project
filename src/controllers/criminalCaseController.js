import { prisma } from "../config/db.js";

export const createCriminalCase = async (req, res) => {
  try {
    const { criminalId, caseId, crimeId, roleInCrime } = req.body;

    const [criminal, caseRecord, crime] = await Promise.all([
      prisma.criminal.findUnique({ where: { id: criminalId } }),
      prisma.case.findUnique({ where: { id: caseId } }),
      prisma.crime.findUnique({ where: { id: crimeId } }),
    ]);

    if (!criminal) {
      return res.status(404).json({
        success: false,
        message: "Criminal not found.",
      });
    }

    if (!caseRecord) {
      return res.status(404).json({
        success: false,
        message: "Case not found.",
      });
    }

    if (!crime) {
      return res.status(404).json({
        success: false,
        message: "Crime not found.",
      });
    }

    const existing = await prisma.criminalCase.findUnique({
      where: {
        criminalId_caseId_crimeId: {
          criminalId,
          caseId,
          crimeId,
        },
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Criminal is already assigned to this crime in the case.",
      });
    }

    const criminalCase = await prisma.criminalCase.create({
      data: {
        criminalId,
        caseId,
        crimeId,
        roleInCrime,
      },
      include: {
        criminal: true,
        case: {
          include: {
            station: true,
          },
        },
        crime: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Criminal case created successfully.",
      data: criminalCase,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create criminal case.",
    });
  }
};

export const getCriminalCases = async (req, res) => {
  try {
    const criminalCases = await prisma.criminalCase.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        criminal: true,
        crime: true,
        case: {
          include: {
            station: true,
            evidence: true,
            arrests: true,
            courtCases: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      count: criminalCases.length,
      data: criminalCases,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve criminal cases.",
    });
  }
};

export const getCriminalCaseById = async (req, res) => {
  try {
    const { id } = req.params;

    const criminalCase = await prisma.criminalCase.findUnique({
      where: { id },
      include: {
        criminal: {
          include: {
            arrests: true,
            sentences: true,
          },
        },
        crime: true,
        case: {
          include: {
            station: true,
            evidence: {
              include: {
                officerLog: true,
              },
            },
            victims: true,
            witnesses: true,
            arrests: true,
            courtCases: {
              include: {
                sentences: true,
              },
            },
          },
        },
      },
    });

    if (!criminalCase) {
      return res.status(404).json({
        success: false,
        message: "Criminal case not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: criminalCase,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve criminal case.",
    });
  }
};

export const updateCriminalCase = async (req, res) => {
  try {
    const { id } = req.params;
    const { criminalId, caseId, crimeId, roleInCrime } = req.body;

    const existing = await prisma.criminalCase.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Criminal case not found.",
      });
    }

    if (criminalId) {
      const criminal = await prisma.criminal.findUnique({
        where: { id: criminalId },
      });

      if (!criminal) {
        return res.status(404).json({
          success: false,
          message: "Criminal not found.",
        });
      }
    }

    if (caseId) {
      const caseRecord = await prisma.case.findUnique({
        where: { id: caseId },
      });

      if (!caseRecord) {
        return res.status(404).json({
          success: false,
          message: "Case not found.",
        });
      }
    }

    if (crimeId) {
      const crime = await prisma.crime.findUnique({
        where: { id: crimeId },
      });

      if (!crime) {
        return res.status(404).json({
          success: false,
          message: "Crime not found.",
        });
      }
    }

    const duplicate = await prisma.criminalCase.findFirst({
      where: {
        criminalId: criminalId ?? existing.criminalId,
        caseId: caseId ?? existing.caseId,
        crimeId: crimeId ?? existing.crimeId,
        NOT: {
          id,
        },
      },
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "Duplicate criminal-case assignment exists.",
      });
    }

    const updated = await prisma.criminalCase.update({
      where: { id },
      data: {
        criminalId,
        caseId,
        crimeId,
        roleInCrime,
      },
      include: {
        criminal: true,
        crime: true,
        case: {
          include: {
            station: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Criminal case updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update criminal case.",
    });
  }
};
export const deleteCriminalCase = async (req, res) => {
  try {
    const { id } = req.params;

    const criminalCase = await prisma.criminalCase.findUnique({
      where: { id },
    });

    if (!criminalCase) {
      return res.status(404).json({
        success: false,
        message: "Criminal case not found.",
      });
    }

    await prisma.criminalCase.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Criminal case deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete criminal case.",
    });
  }
};