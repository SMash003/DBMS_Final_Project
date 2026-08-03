import { prisma } from "../config/db.js";

export const createWitness = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      contactInfo,
      statementSummary,
      protectionStatus,
      caseId,
    } = req.body;

    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!caseRecord) {
      return res.status(404).json({
        success: false,
        message: "Case not found.",
      });
    }

    const witness = await prisma.witness.create({
      data: {
        firstName,
        lastName,
        gender,
        contactInfo,
        statementSummary,
        protectionStatus,
        caseId,
      },
      include: {
        case: {
          include: {
            station: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Witness created successfully.",
      data: witness,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create witness.",
    });
  }
};

export const getWitnesses = async (req, res) => {
  try {
    const witnesses = await prisma.witness.findMany({
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
      },
    });

    return res.status(200).json({
      success: true,
      count: witnesses.length,
      data: witnesses,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve witnesses.",
    });
  }
};

export const getWitnessById = async (req, res) => {
  try {
    const { id } = req.params;

    const witness = await prisma.witness.findUnique({
      where: { id },
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
            arrests: true,
            victims: true,
            courtCases: {
              include: {
                sentences: true,
              },
            },
          },
        },
      },
    });

    if (!witness) {
      return res.status(404).json({
        success: false,
        message: "Witness not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: witness,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve witness.",
    });
  }
};

export const updateWitness = async (req, res) => {
  try {
    const { id } = req.params;

    const existingWitness = await prisma.witness.findUnique({
      where: { id },
    });

    if (!existingWitness) {
      return res.status(404).json({
        success: false,
        message: "Witness not found.",
      });
    }

    const {
      firstName,
      lastName,
      gender,
      contactInfo,
      statementSummary,
      protectionStatus,
      caseId,
    } = req.body;

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

    const updatedWitness = await prisma.witness.update({
      where: { id },
      data: {
        firstName,
        lastName,
        gender,
        contactInfo,
        statementSummary,
        protectionStatus,
        caseId,
      },
      include: {
        case: {
          include: {
            station: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Witness updated successfully.",
      data: updatedWitness,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update witness.",
    });
  }
};

export const deleteWitness = async (req, res) => {
  try {
    const { id } = req.params;

    const witness = await prisma.witness.findUnique({
      where: { id },
    });

    if (!witness) {
      return res.status(404).json({
        success: false,
        message: "Witness not found.",
      });
    }

    await prisma.witness.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Witness deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete witness.",
    });
  }
};