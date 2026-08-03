import { prisma } from "../config/db.js";

export const createArrest = async (req, res) => {
  try {
    const {
      arrestDateTime,
      arrestLocation,
      criminalId,
      caseId,
      officerId,
    } = req.body;

    const [criminal, caseRecord, officer] = await Promise.all([
      prisma.criminal.findUnique({
        where: { id: criminalId },
      }),
      prisma.case.findUnique({
        where: { id: caseId },
      }),
      prisma.officer.findUnique({
        where: { id: officerId },
      }),
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

    if (!officer) {
      return res.status(404).json({
        success: false,
        message: "Officer not found.",
      });
    }

    const arrest = await prisma.arrest.create({
      data: {
        arrestDateTime: new Date(arrestDateTime),
        arrestLocation,
        criminalId,
        caseId,
        officerId,
      },
      include: {
        criminal: true,
        case: {
          include: {
            station: true,
          },
        },
        officer: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Arrest created successfully.",
      data: arrest,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create arrest.",
    });
  }
};

export const getArrests = async (req, res) => {
  try {
    const arrests = await prisma.arrest.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        criminal: true,
        case: {
          include: {
            station: true,
            criminalCases: {
              include: {
                crime: true,
              },
            },
          },
        },
        officer: true,
      },
    });

    return res.status(200).json({
      success: true,
      count: arrests.length,
      data: arrests,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve arrests.",
    });
  }
};

export const getArrestById = async (req, res) => {
  try {
    const { id } = req.params;

    const arrest = await prisma.arrest.findUnique({
      where: {
        id,
      },
      include: {
        criminal: {
          include: {
            criminalCases: {
              include: {
                case: true,
                crime: true,
              },
            },
            sentences: true,
          },
        },
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
            courtCases: {
              include: {
                sentences: true,
              },
            },
          },
        },
        officer: {
          include: {
            station: true,
          },
        },
      },
    });

    if (!arrest) {
      return res.status(404).json({
        success: false,
        message: "Arrest not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: arrest,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve arrest.",
    });
  }
};

export const updateArrest = async (req, res) => {
  try {
    const { id } = req.params;

    const existingArrest = await prisma.arrest.findUnique({
      where: {
        id,
      },
    });

    if (!existingArrest) {
      return res.status(404).json({
        success: false,
        message: "Arrest not found.",
      });
    }

    const {
      arrestDateTime,
      arrestLocation,
      criminalId,
      caseId,
      officerId,
    } = req.body;

    if (criminalId) {
      const criminal = await prisma.criminal.findUnique({
        where: {
          id: criminalId,
        },
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

    if (officerId) {
      const officer = await prisma.officer.findUnique({
        where: {
          id: officerId,
        },
      });

      if (!officer) {
        return res.status(404).json({
          success: false,
          message: "Officer not found.",
        });
      }
    }

    const updatedArrest = await prisma.arrest.update({
      where: {
        id,
      },
      data: {
        arrestDateTime: arrestDateTime
          ? new Date(arrestDateTime)
          : undefined,
        arrestLocation,
        criminalId,
        caseId,
        officerId,
      },
      include: {
        criminal: true,
        case: {
          include: {
            station: true,
          },
        },
        officer: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Arrest updated successfully.",
      data: updatedArrest,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update arrest.",
    });
  }
};