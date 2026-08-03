import { prisma } from "../config/db.js";

export const createSentence = async (req, res) => {
  try {
    const {
      sentenceType,
      durationMonths,
      fineAmount,
      startDate,
      courtCaseId,
      criminalId,
    } = req.body;

    const [courtCase, criminal] = await Promise.all([
      prisma.courtCase.findUnique({
        where: {
          id: courtCaseId,
        },
      }),
      prisma.criminal.findUnique({
        where: {
          id: criminalId,
        },
      }),
    ]);

    if (!courtCase) {
      return res.status(404).json({
        success: false,
        message: "Court case not found.",
      });
    }

    if (!criminal) {
      return res.status(404).json({
        success: false,
        message: "Criminal not found.",
      });
    }

    const sentence = await prisma.sentence.create({
      data: {
        sentenceType,
        durationMonths,
        fineAmount,
        startDate: startDate ? new Date(startDate) : null,
        courtCaseId,
        criminalId,
      },
      include: {
        courtCase: {
          include: {
            case: {
              include: {
                station: true,
              },
            },
          },
        },
        criminal: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Sentence created successfully.",
      data: sentence,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create sentence.",
    });
  }
};

export const getSentences = async (req, res) => {
  try {
    const sentences = await prisma.sentence.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        criminal: true,
        courtCase: {
          include: {
            case: {
              include: {
                station: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      count: sentences.length,
      data: sentences,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve sentences.",
    });
  }
};

export const getSentenceById = async (req, res) => {
  try {
    const { id } = req.params;

    const sentence = await prisma.sentence.findUnique({
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
            arrests: true,
          },
        },
        courtCase: {
          include: {
            case: {
              include: {
                station: true,
                victims: true,
                witnesses: true,
                evidence: {
                  include: {
                    officerLog: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!sentence) {
      return res.status(404).json({
        success: false,
        message: "Sentence not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: sentence,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve sentence.",
    });
  }
};

export const updateSentence = async (req, res) => {
  try {
    const { id } = req.params;

    const existingSentence = await prisma.sentence.findUnique({
      where: {
        id,
      },
    });

    if (!existingSentence) {
      return res.status(404).json({
        success: false,
        message: "Sentence not found.",
      });
    }

    const {
      sentenceType,
      durationMonths,
      fineAmount,
      startDate,
      courtCaseId,
      criminalId,
    } = req.body;

    if (courtCaseId) {
      const courtCase = await prisma.courtCase.findUnique({
        where: {
          id: courtCaseId,
        },
      });

      if (!courtCase) {
        return res.status(404).json({
          success: false,
          message: "Court case not found.",
        });
      }
    }

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

    const updatedSentence = await prisma.sentence.update({
      where: {
        id,
      },
      data: {
        sentenceType,
        durationMonths,
        fineAmount,
        startDate:
          startDate !== undefined
            ? startDate
              ? new Date(startDate)
              : null
            : undefined,
        courtCaseId,
        criminalId,
      },
      include: {
        criminal: true,
        courtCase: {
          include: {
            case: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Sentence updated successfully.",
      data: updatedSentence,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update sentence.",
    });
  }
};