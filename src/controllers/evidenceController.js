import { prisma } from "../config/db.js";

export const createEvidence = async (req, res) => {
  try {
    const {
      evidenceCode,
      description,
      dateCollected,
      storageLocation,
      caseId,
      collectedByOfficerId,
    } = req.body;

    const [caseRecord, officer] = await Promise.all([
      prisma.case.findUnique({
        where: { id: caseId },
      }),
      prisma.officer.findUnique({
        where: { id: collectedByOfficerId },
      }),
    ]);

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

    const existingEvidence = await prisma.evidence.findUnique({
      where: {
        evidenceCode,
      },
    });

    if (existingEvidence) {
      return res.status(409).json({
        success: false,
        message: "Evidence code already exists.",
      });
    }

    const evidence = await prisma.evidence.create({
      data: {
        evidenceCode,
        description,
        dateCollected: new Date(dateCollected),
        storageLocation,
        caseId,
        collectedByOfficerId,
      },
      include: {
        case: {
          include: {
            station: true,
          },
        },
        officerLog: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Evidence created successfully.",
      data: evidence,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create evidence.",
    });
  }
};

export const getEvidence = async (req, res) => {
  try {
    const evidence = await prisma.evidence.findMany({
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
          },
        },
        officerLog: true,
      },
    });

    return res.status(200).json({
      success: true,
      count: evidence.length,
      data: evidence,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve evidence.",
    });
  }
};

export const getEvidenceById = async (req, res) => {
  try {
    const { id } = req.params;

    const evidence = await prisma.evidence.findUnique({
      where: {
        id,
      },
      include: {
        case: {
          include: {
            station: true,
            victims: true,
            witnesses: true,
            criminalCases: {
              include: {
                criminal: true,
                crime: true,
              },
            },
            courtCases: {
              include: {
                sentences: true,
              },
            },
          },
        },
        officerLog: true,
      },
    });

    if (!evidence) {
      return res.status(404).json({
        success: false,
        message: "Evidence not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: evidence,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve evidence.",
    });
  }
};

export const updateEvidence = async (req, res) => {
  try {
    const { id } = req.params;

    const existingEvidence = await prisma.evidence.findUnique({
      where: {
        id,
      },
    });

    if (!existingEvidence) {
      return res.status(404).json({
        success: false,
        message: "Evidence not found.",
      });
    }

    const {
      evidenceCode,
      description,
      dateCollected,
      storageLocation,
      caseId,
      collectedByOfficerId,
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

    if (collectedByOfficerId) {
      const officer = await prisma.officer.findUnique({
        where: {
          id: collectedByOfficerId,
        },
      });

      if (!officer) {
        return res.status(404).json({
          success: false,
          message: "Officer not found.",
        });
      }
    }

    if (
      evidenceCode &&
      evidenceCode !== existingEvidence.evidenceCode
    ) {
      const duplicate = await prisma.evidence.findUnique({
        where: {
          evidenceCode,
        },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Evidence code already exists.",
        });
      }
    }

    const updatedEvidence = await prisma.evidence.update({
      where: {
        id,
      },
      data: {
        evidenceCode,
        description,
        dateCollected: dateCollected
          ? new Date(dateCollected)
          : undefined,
        storageLocation,
        caseId,
        collectedByOfficerId,
      },
      include: {
        case: {
          include: {
            station: true,
          },
        },
        officerLog: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Evidence updated successfully.",
      data: updatedEvidence,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update evidence.",
    });
  }
};