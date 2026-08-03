import { prisma } from "../config/db.js";

export const createVictim = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      contactInfo,
      statement,
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

    const victim = await prisma.victim.create({
      data: {
        firstName,
        lastName,
        gender,
        contactInfo,
        statement,
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
      message: "Victim created successfully.",
      data: victim,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create victim.",
    });
  }
};

export const getVictims = async (req, res) => {
  try {
    const victims = await prisma.victim.findMany({
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
      count: victims.length,
      data: victims,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve victims.",
    });
  }
};

export const getVictimById = async (req, res) => {
  try {
    const { id } = req.params;

    const victim = await prisma.victim.findUnique({
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
            courtCases: {
              include: {
                sentences: true,
              },
            },
            witnesses: true,
          },
        },
      },
    });

    if (!victim) {
      return res.status(404).json({
        success: false,
        message: "Victim not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: victim,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve victim.",
    });
  }
};

export const updateVictim = async (req, res) => {
  try {
    const { id } = req.params;

    const existingVictim = await prisma.victim.findUnique({
      where: { id },
    });

    if (!existingVictim) {
      return res.status(404).json({
        success: false,
        message: "Victim not found.",
      });
    }

    const {
      firstName,
      lastName,
      gender,
      contactInfo,
      statement,
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

    const updatedVictim = await prisma.victim.update({
      where: { id },
      data: {
        firstName,
        lastName,
        gender,
        contactInfo,
        statement,
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
      message: "Victim updated successfully.",
      data: updatedVictim,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update victim.",
    });
  }
};

export const deleteVictim = async (req, res) => {
  try {
    const { id } = req.params;

    const victim = await prisma.victim.findUnique({
      where: { id },
    });

    if (!victim) {
      return res.status(404).json({
        success: false,
        message: "Victim not found.",
      });
    }

    await prisma.victim.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Victim deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete victim.",
    });
  }
};