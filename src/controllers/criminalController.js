import { prisma } from "../config/db.js";

//fetching all criminals
export const getCriminals = async (req, res) => {
  try {
    const criminals = await prisma.criminal.findMany({
      include: {
        criminalCases: {
          include: {
            case: {
              include: {
                station: true,
              },
            },
            crime: true,
          },
        },
        arrests: {
          include: {
            case: true,
            officer: true,
          },
        },
        sentences: {
          include: {
            courtCase: {
              include: {
                case: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: criminals.length,
      data: criminals,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve criminals.",
    });
  }
};

//getting criminals with id
export const getCriminalById = async (req, res) => {
  try {
    const { id } = req.params;

    const criminal = await prisma.criminal.findUnique({
      where: { id },
      include: {
        criminalCases: {
          include: {
            case: {
              include: {
                station: true,
              },
            },
            crime: true,
          },
        },
        arrests: {
          include: {
            case: true,
            officer: true,
          },
        },
        sentences: {
          include: {
            courtCase: {
              include: {
                case: true,
              },
            },
          },
        },
      },
    });

    if (!criminal) {
      return res.status(404).json({
        success: false,
        message: "Criminal not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: criminal,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve criminal.",
    });
  }
};

//adding new criminals
export const createCriminal = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      aliases,
      address,
      nidNumber,
    } = req.body;

    const existing = await prisma.criminal.findUnique({
      where: {
        nidNumber,
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Criminal with this NID already exists.",
      });
    }

    const criminal = await prisma.criminal.create({
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        aliases,
        address,
        nidNumber,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Criminal created successfully.",
      data: criminal,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create criminal.",
    });
  }
};


 //update
export const updateCriminal = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.criminal.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Criminal not found.",
      });
    }

    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      aliases,
      address,
      nidNumber,
    } = req.body;

    if (nidNumber && nidNumber !== existing.nidNumber) {
      const duplicate = await prisma.criminal.findUnique({
        where: {
          nidNumber,
        },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "NID already exists.",
        });
      }
    }

    const criminal = await prisma.criminal.update({
      where: { id },
      data: {
        firstName,
        lastName,
        gender,
        aliases,
        address,
        nidNumber,
        ...(dateOfBirth && {
          dateOfBirth: new Date(dateOfBirth),
        }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Criminal updated successfully.",
      data: criminal,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update criminal.",
    });
  }
};