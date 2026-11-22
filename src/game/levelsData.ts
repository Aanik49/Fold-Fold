import { CategoryDef } from './types';

// Auto-generated and 100% BFS-verified optimal-par levels (5 categories x 20 levels = 100 levels)
export const CATEGORIES: CategoryDef[] = [
  {
    "id": "c1",
    "code": "01",
    "title": "FIRST CREASE",
    "subtitle": "Foundations of Folding",
    "cardColor": "#1D3557",
    "cardText": "#FAF8F5",
    "undersideColor": "#1D3557",
    "previewSymbols": [
      "circle",
      "circle",
      "cross",
      "cross"
    ],
    "mechanicNote": "Swipe any row or column crease to align matching geometric ink symbols.",
    "levels": [
      {
        "id": "c1-01",
        "categoryId": "c1",
        "indexInCategory": 0,
        "code": "01",
        "title": "First Crease",
        "hintText": "SWIPE ACROSS A DOTTED CREASE TO FOLD MATCHING SYMBOLS TOGETHER",
        "rows": 2,
        "cols": 2,
        "par": 1,
        "symbols": [
          {
            "r": 0,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 1,
            "type": "cross"
          }
        ],
        "tapes": [],
        "pins": []
      },
      {
        "id": "c1-02",
        "categoryId": "c1",
        "indexInCategory": 1,
        "code": "02",
        "title": "Twin Circles",
        "hintText": "THE PAPER STAYS FOLDED — PLAN YOUR NEXT CREASE AFTER EACH FOLD",
        "rows": 2,
        "cols": 3,
        "par": 2,
        "symbols": [
          {
            "r": 0,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 2,
            "type": "cross"
          }
        ],
        "tapes": [],
        "pins": []
      },
      {
        "id": "c1-03",
        "categoryId": "c1",
        "indexInCategory": 2,
        "code": "03",
        "title": "Cross Registration",
        "rows": 3,
        "cols": 2,
        "par": 2,
        "symbols": [
          {
            "r": 1,
            "c": 1,
            "type": "square"
          },
          {
            "r": 2,
            "c": 1,
            "type": "square"
          },
          {
            "r": 0,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 0,
            "type": "triangle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "MATCHING INK SYMBOLS CANCEL OUT AND DISAPPEAR ON CONTACT"
      },
      {
        "id": "c1-04",
        "categoryId": "c1",
        "indexInCategory": 3,
        "code": "04",
        "title": "Clean Margin",
        "rows": 2,
        "cols": 3,
        "par": 2,
        "symbols": [
          {
            "r": 1,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 0,
            "type": "square"
          },
          {
            "r": 0,
            "c": 1,
            "type": "square"
          },
          {
            "r": 1,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 2,
            "type": "cross"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "SWIPE ACROSS A DOTTED CREASE TO FOLD MATCHING SYMBOLS TOGETHER"
      },
      {
        "id": "c1-05",
        "categoryId": "c1",
        "indexInCategory": 4,
        "code": "05",
        "title": "Quarter Fold",
        "rows": 2,
        "cols": 4,
        "par": 2,
        "symbols": [
          {
            "r": 1,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 3,
            "type": "square"
          },
          {
            "r": 0,
            "c": 1,
            "type": "square"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "THE PAPER STAYS FOLDED — PLAN YOUR NEXT CREASE AFTER EACH FOLD"
      },
      {
        "id": "c1-06",
        "categoryId": "c1",
        "indexInCategory": 5,
        "code": "06",
        "title": "Newsprint Pair",
        "rows": 3,
        "cols": 3,
        "par": 2,
        "symbols": [
          {
            "r": 1,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 2,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 2,
            "type": "square"
          },
          {
            "r": 2,
            "c": 2,
            "type": "square"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "MATCHING INK SYMBOLS CANCEL OUT AND DISAPPEAR ON CONTACT"
      },
      {
        "id": "c1-07",
        "categoryId": "c1",
        "indexInCategory": 6,
        "code": "07",
        "title": "Corner Proof",
        "rows": 2,
        "cols": 4,
        "par": 3,
        "symbols": [
          {
            "r": 1,
            "c": 1,
            "type": "square"
          },
          {
            "r": 1,
            "c": 3,
            "type": "square"
          },
          {
            "r": 0,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "triangle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "SWIPE ACROSS A DOTTED CREASE TO FOLD MATCHING SYMBOLS TOGETHER"
      },
      {
        "id": "c1-08",
        "categoryId": "c1",
        "indexInCategory": 7,
        "code": "08",
        "title": "Offset Line",
        "rows": 3,
        "cols": 3,
        "par": 3,
        "symbols": [
          {
            "r": 0,
            "c": 2,
            "type": "square"
          },
          {
            "r": 0,
            "c": 0,
            "type": "square"
          },
          {
            "r": 0,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 1,
            "type": "circle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "THE PAPER STAYS FOLDED — PLAN YOUR NEXT CREASE AFTER EACH FOLD"
      },
      {
        "id": "c1-09",
        "categoryId": "c1",
        "indexInCategory": 8,
        "code": "09",
        "title": "Red & Cobalt",
        "rows": 3,
        "cols": 3,
        "par": 3,
        "symbols": [
          {
            "r": 1,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 1,
            "type": "square"
          },
          {
            "r": 0,
            "c": 2,
            "type": "square"
          },
          {
            "r": 2,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 2,
            "type": "triangle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "MATCHING INK SYMBOLS CANCEL OUT AND DISAPPEAR ON CONTACT"
      },
      {
        "id": "c1-10",
        "categoryId": "c1",
        "indexInCategory": 9,
        "code": "10",
        "title": "Triad Press",
        "rows": 2,
        "cols": 4,
        "par": 3,
        "symbols": [
          {
            "r": 0,
            "c": 3,
            "type": "square"
          },
          {
            "r": 0,
            "c": 2,
            "type": "square"
          },
          {
            "r": 1,
            "c": 3,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 1,
            "type": "circle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "SWIPE ACROSS A DOTTED CREASE TO FOLD MATCHING SYMBOLS TOGETHER"
      },
      {
        "id": "c1-11",
        "categoryId": "c1",
        "indexInCategory": 10,
        "code": "11",
        "title": "Paper Grain",
        "rows": 3,
        "cols": 3,
        "par": 3,
        "symbols": [
          {
            "r": 0,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 2,
            "type": "square"
          },
          {
            "r": 2,
            "c": 1,
            "type": "square"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "THE PAPER STAYS FOLDED — PLAN YOUR NEXT CREASE AFTER EACH FOLD"
      },
      {
        "id": "c1-12",
        "categoryId": "c1",
        "indexInCategory": 11,
        "code": "12",
        "title": "Four Corners",
        "rows": 3,
        "cols": 4,
        "par": 3,
        "symbols": [
          {
            "r": 2,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 0,
            "type": "square"
          },
          {
            "r": 0,
            "c": 2,
            "type": "square"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "MATCHING INK SYMBOLS CANCEL OUT AND DISAPPEAR ON CONTACT"
      },
      {
        "id": "c1-13",
        "categoryId": "c1",
        "indexInCategory": 12,
        "code": "13",
        "title": "Swiss Grid",
        "rows": 4,
        "cols": 3,
        "par": 3,
        "symbols": [
          {
            "r": 3,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 3,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 2,
            "type": "square"
          },
          {
            "r": 1,
            "c": 0,
            "type": "square"
          },
          {
            "r": 0,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 3,
            "c": 2,
            "type": "circle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "SWIPE ACROSS A DOTTED CREASE TO FOLD MATCHING SYMBOLS TOGETHER"
      },
      {
        "id": "c1-14",
        "categoryId": "c1",
        "indexInCategory": 13,
        "code": "14",
        "title": "Double Seam",
        "rows": 3,
        "cols": 4,
        "par": 3,
        "symbols": [
          {
            "r": 1,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 3,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 2,
            "c": 1,
            "type": "square"
          },
          {
            "r": 2,
            "c": 2,
            "type": "square"
          },
          {
            "r": 2,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 0,
            "type": "triangle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "THE PAPER STAYS FOLDED — PLAN YOUR NEXT CREASE AFTER EACH FOLD"
      },
      {
        "id": "c1-15",
        "categoryId": "c1",
        "indexInCategory": 14,
        "code": "15",
        "title": "Center Spine",
        "rows": 3,
        "cols": 4,
        "par": 4,
        "symbols": [
          {
            "r": 1,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 0,
            "type": "square"
          },
          {
            "r": 1,
            "c": 1,
            "type": "square"
          },
          {
            "r": 0,
            "c": 3,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 3,
            "type": "triangle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "MATCHING INK SYMBOLS CANCEL OUT AND DISAPPEAR ON CONTACT"
      },
      {
        "id": "c1-16",
        "categoryId": "c1",
        "indexInCategory": 15,
        "code": "16",
        "title": "Halftone Balance",
        "rows": 3,
        "cols": 4,
        "par": 4,
        "symbols": [
          {
            "r": 0,
            "c": 1,
            "type": "square"
          },
          {
            "r": 1,
            "c": 1,
            "type": "square"
          },
          {
            "r": 1,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 2,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 3,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 3,
            "type": "circle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "SWIPE ACROSS A DOTTED CREASE TO FOLD MATCHING SYMBOLS TOGETHER"
      },
      {
        "id": "c1-17",
        "categoryId": "c1",
        "indexInCategory": 16,
        "code": "17",
        "title": "Ink Symmetry",
        "rows": 4,
        "cols": 3,
        "par": 4,
        "symbols": [
          {
            "r": 3,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 3,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 2,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 1,
            "type": "square"
          },
          {
            "r": 3,
            "c": 1,
            "type": "square"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "THE PAPER STAYS FOLDED — PLAN YOUR NEXT CREASE AFTER EACH FOLD"
      },
      {
        "id": "c1-18",
        "categoryId": "c1",
        "indexInCategory": 17,
        "code": "18",
        "title": "Gallery Sheet",
        "rows": 4,
        "cols": 4,
        "par": 4,
        "symbols": [
          {
            "r": 1,
            "c": 3,
            "type": "square"
          },
          {
            "r": 3,
            "c": 2,
            "type": "square"
          },
          {
            "r": 0,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 3,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 0,
            "type": "triangle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "MATCHING INK SYMBOLS CANCEL OUT AND DISAPPEAR ON CONTACT"
      },
      {
        "id": "c1-19",
        "categoryId": "c1",
        "indexInCategory": 18,
        "code": "19",
        "title": "Broadsheet Study",
        "rows": 4,
        "cols": 4,
        "par": 4,
        "symbols": [
          {
            "r": 1,
            "c": 3,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 3,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 1,
            "type": "square"
          },
          {
            "r": 0,
            "c": 1,
            "type": "square"
          },
          {
            "r": 3,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 2,
            "c": 2,
            "type": "cross"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "SWIPE ACROSS A DOTTED CREASE TO FOLD MATCHING SYMBOLS TOGETHER"
      },
      {
        "id": "c1-20",
        "categoryId": "c1",
        "indexInCategory": 19,
        "code": "20",
        "title": "Studio Proof",
        "rows": 4,
        "cols": 4,
        "par": 4,
        "symbols": [
          {
            "r": 1,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 3,
            "c": 2,
            "type": "square"
          },
          {
            "r": 3,
            "c": 1,
            "type": "square"
          },
          {
            "r": 2,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 2,
            "type": "circle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "THE PAPER STAYS FOLDED — PLAN YOUR NEXT CREASE AFTER EACH FOLD"
      }
    ]
  },
  {
    "id": "c2",
    "code": "02",
    "title": "LAYERED ORDER",
    "subtitle": "Depth & Sequencing",
    "cardColor": "#E63946",
    "cardText": "#FAF8F5",
    "undersideColor": "#E63946",
    "previewSymbols": [
      "circle",
      "triangle",
      "square",
      "cross"
    ],
    "mechanicNote": "Paper stays folded! Sequence your creases so mismatched sheets do not trap pairs.",
    "levels": [
      {
        "id": "c2-01",
        "categoryId": "c2",
        "indexInCategory": 0,
        "code": "01",
        "title": "Layered Order",
        "hintText": "FOLD IN THE RIGHT ORDER SO NON-MATCHING SYMBOLS DO NOT TRAP PAIRS",
        "rows": 3,
        "cols": 3,
        "par": 4,
        "symbols": [
          {
            "r": 0,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 2,
            "type": "square"
          },
          {
            "r": 1,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 0,
            "type": "square"
          }
        ],
        "tapes": [],
        "pins": []
      },
      {
        "id": "c2-02",
        "categoryId": "c2",
        "indexInCategory": 1,
        "code": "02",
        "title": "Hidden Stock",
        "rows": 3,
        "cols": 3,
        "par": 3,
        "symbols": [
          {
            "r": 2,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 2,
            "type": "square"
          },
          {
            "r": 2,
            "c": 2,
            "type": "square"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "CORNER RED DOG-EARS SHOW A SYMBOL TRAPPED UNDER THE TOP LAYER"
      },
      {
        "id": "c2-03",
        "categoryId": "c2",
        "indexInCategory": 2,
        "code": "03",
        "title": "Underprint",
        "rows": 3,
        "cols": 3,
        "par": 3,
        "symbols": [
          {
            "r": 0,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 2,
            "type": "square"
          },
          {
            "r": 2,
            "c": 2,
            "type": "square"
          },
          {
            "r": 2,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 1,
            "type": "circle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "MATCH THE TOP SYMBOL ON A STACK TO UNCOVER THE LAYER BENEATH IT"
      },
      {
        "id": "c2-04",
        "categoryId": "c2",
        "indexInCategory": 3,
        "code": "04",
        "title": "Second Ply",
        "rows": 2,
        "cols": 4,
        "par": 3,
        "symbols": [
          {
            "r": 1,
            "c": 3,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "square"
          },
          {
            "r": 0,
            "c": 2,
            "type": "square"
          },
          {
            "r": 0,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 1,
            "type": "circle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "FOLD IN THE RIGHT ORDER SO NON-MATCHING SYMBOLS DO NOT TRAP PAIRS"
      },
      {
        "id": "c2-05",
        "categoryId": "c2",
        "indexInCategory": 4,
        "code": "05",
        "title": "Folio Sequence",
        "rows": 3,
        "cols": 4,
        "par": 3,
        "symbols": [
          {
            "r": 2,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "square"
          },
          {
            "r": 1,
            "c": 2,
            "type": "square"
          },
          {
            "r": 2,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 1,
            "type": "triangle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "CORNER RED DOG-EARS SHOW A SYMBOL TRAPPED UNDER THE TOP LAYER"
      },
      {
        "id": "c2-06",
        "categoryId": "c2",
        "indexInCategory": 5,
        "code": "06",
        "title": "Stacked Ink",
        "rows": 4,
        "cols": 3,
        "par": 3,
        "symbols": [
          {
            "r": 0,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 3,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 3,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 1,
            "type": "square"
          },
          {
            "r": 1,
            "c": 0,
            "type": "square"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "MATCH THE TOP SYMBOL ON A STACK TO UNCOVER THE LAYER BENEATH IT"
      },
      {
        "id": "c2-07",
        "categoryId": "c2",
        "indexInCategory": 6,
        "code": "07",
        "title": "Overprint Trap",
        "rows": 3,
        "cols": 3,
        "par": 4,
        "symbols": [
          {
            "r": 2,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 0,
            "type": "circle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "FOLD IN THE RIGHT ORDER SO NON-MATCHING SYMBOLS DO NOT TRAP PAIRS"
      },
      {
        "id": "c2-08",
        "categoryId": "c2",
        "indexInCategory": 7,
        "code": "08",
        "title": "Deep Crease",
        "rows": 3,
        "cols": 3,
        "par": 4,
        "symbols": [
          {
            "r": 1,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 1,
            "type": "square"
          },
          {
            "r": 2,
            "c": 1,
            "type": "square"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "CORNER RED DOG-EARS SHOW A SYMBOL TRAPPED UNDER THE TOP LAYER"
      },
      {
        "id": "c2-09",
        "categoryId": "c2",
        "indexInCategory": 8,
        "code": "09",
        "title": "Fold Cascade",
        "rows": 3,
        "cols": 4,
        "par": 4,
        "symbols": [
          {
            "r": 2,
            "c": 3,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 1,
            "type": "square"
          },
          {
            "r": 1,
            "c": 2,
            "type": "square"
          },
          {
            "r": 1,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 0,
            "type": "triangle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "MATCH THE TOP SYMBOL ON A STACK TO UNCOVER THE LAYER BENEATH IT"
      },
      {
        "id": "c2-10",
        "categoryId": "c2",
        "indexInCategory": 9,
        "code": "10",
        "title": "Crossed Plies",
        "rows": 3,
        "cols": 4,
        "par": 4,
        "symbols": [
          {
            "r": 1,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 2,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 2,
            "c": 1,
            "type": "square"
          },
          {
            "r": 1,
            "c": 1,
            "type": "square"
          },
          {
            "r": 0,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 0,
            "type": "circle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "FOLD IN THE RIGHT ORDER SO NON-MATCHING SYMBOLS DO NOT TRAP PAIRS"
      },
      {
        "id": "c2-11",
        "categoryId": "c2",
        "indexInCategory": 10,
        "code": "11",
        "title": "Press Register",
        "rows": 4,
        "cols": 3,
        "par": 4,
        "symbols": [
          {
            "r": 3,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 3,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 3,
            "c": 1,
            "type": "square"
          },
          {
            "r": 0,
            "c": 0,
            "type": "square"
          },
          {
            "r": 1,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 2,
            "c": 2,
            "type": "cross"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "CORNER RED DOG-EARS SHOW A SYMBOL TRAPPED UNDER THE TOP LAYER"
      },
      {
        "id": "c2-12",
        "categoryId": "c2",
        "indexInCategory": 11,
        "code": "12",
        "title": "Nested Squares",
        "rows": 3,
        "cols": 4,
        "par": 4,
        "symbols": [
          {
            "r": 1,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 3,
            "type": "square"
          },
          {
            "r": 0,
            "c": 2,
            "type": "square"
          },
          {
            "r": 2,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 2,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 2,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 1,
            "type": "circle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "MATCH THE TOP SYMBOL ON A STACK TO UNCOVER THE LAYER BENEATH IT"
      },
      {
        "id": "c2-13",
        "categoryId": "c2",
        "indexInCategory": 12,
        "code": "13",
        "title": "Spine Priority",
        "rows": 4,
        "cols": 4,
        "par": 4,
        "symbols": [
          {
            "r": 0,
            "c": 3,
            "type": "square"
          },
          {
            "r": 1,
            "c": 2,
            "type": "square"
          },
          {
            "r": 2,
            "c": 3,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 3,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 3,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 2,
            "type": "circle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "FOLD IN THE RIGHT ORDER SO NON-MATCHING SYMBOLS DO NOT TRAP PAIRS"
      },
      {
        "id": "c2-14",
        "categoryId": "c2",
        "indexInCategory": 13,
        "code": "14",
        "title": "Mirror Stack",
        "rows": 4,
        "cols": 4,
        "par": 4,
        "symbols": [
          {
            "r": 1,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 3,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 2,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 3,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 3,
            "type": "circle"
          },
          {
            "r": 3,
            "c": 0,
            "type": "square"
          },
          {
            "r": 0,
            "c": 0,
            "type": "square"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "CORNER RED DOG-EARS SHOW A SYMBOL TRAPPED UNDER THE TOP LAYER"
      },
      {
        "id": "c2-15",
        "categoryId": "c2",
        "indexInCategory": 14,
        "code": "15",
        "title": "Triple Layer",
        "rows": 4,
        "cols": 4,
        "par": 4,
        "symbols": [
          {
            "r": 2,
            "c": 2,
            "type": "square"
          },
          {
            "r": 1,
            "c": 2,
            "type": "square"
          },
          {
            "r": 1,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 3,
            "type": "triangle"
          },
          {
            "r": 3,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 3,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 3,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 3,
            "type": "square"
          },
          {
            "r": 1,
            "c": 0,
            "type": "square"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "MATCH THE TOP SYMBOL ON A STACK TO UNCOVER THE LAYER BENEATH IT"
      },
      {
        "id": "c2-16",
        "categoryId": "c2",
        "indexInCategory": 15,
        "code": "16",
        "title": "Folio Interlock",
        "rows": 3,
        "cols": 4,
        "par": 5,
        "symbols": [
          {
            "r": 2,
            "c": 2,
            "type": "square"
          },
          {
            "r": 0,
            "c": 3,
            "type": "square"
          },
          {
            "r": 0,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 3,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 0,
            "type": "cross"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "FOLD IN THE RIGHT ORDER SO NON-MATCHING SYMBOLS DO NOT TRAP PAIRS"
      },
      {
        "id": "c2-17",
        "categoryId": "c2",
        "indexInCategory": 16,
        "code": "17",
        "title": "Counterfold",
        "rows": 4,
        "cols": 3,
        "par": 5,
        "symbols": [
          {
            "r": 2,
            "c": 1,
            "type": "square"
          },
          {
            "r": 2,
            "c": 2,
            "type": "square"
          },
          {
            "r": 1,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 3,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 3,
            "c": 0,
            "type": "cross"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "CORNER RED DOG-EARS SHOW A SYMBOL TRAPPED UNDER THE TOP LAYER"
      },
      {
        "id": "c2-18",
        "categoryId": "c2",
        "indexInCategory": 17,
        "code": "18",
        "title": "Offset Cascade",
        "rows": 4,
        "cols": 4,
        "par": 5,
        "symbols": [
          {
            "r": 1,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 3,
            "c": 3,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 1,
            "type": "square"
          },
          {
            "r": 1,
            "c": 3,
            "type": "square"
          },
          {
            "r": 2,
            "c": 3,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 3,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 3,
            "c": 0,
            "type": "cross"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "MATCH THE TOP SYMBOL ON A STACK TO UNCOVER THE LAYER BENEATH IT"
      },
      {
        "id": "c2-19",
        "categoryId": "c2",
        "indexInCategory": 18,
        "code": "19",
        "title": "Dense Proof",
        "rows": 4,
        "cols": 4,
        "par": 5,
        "symbols": [
          {
            "r": 1,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 3,
            "c": 3,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 3,
            "type": "square"
          },
          {
            "r": 1,
            "c": 2,
            "type": "square"
          },
          {
            "r": 3,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 3,
            "type": "cross"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "FOLD IN THE RIGHT ORDER SO NON-MATCHING SYMBOLS DO NOT TRAP PAIRS"
      },
      {
        "id": "c2-20",
        "categoryId": "c2",
        "indexInCategory": 19,
        "code": "20",
        "title": "Archival Stack",
        "rows": 4,
        "cols": 4,
        "par": 5,
        "symbols": [
          {
            "r": 0,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 3,
            "c": 3,
            "type": "square"
          },
          {
            "r": 1,
            "c": 2,
            "type": "square"
          },
          {
            "r": 2,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 3,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 2,
            "type": "circle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "CORNER RED DOG-EARS SHOW A SYMBOL TRAPPED UNDER THE TOP LAYER"
      }
    ]
  },
  {
    "id": "c3",
    "code": "03",
    "title": "ONE-WAY TAPE",
    "subtitle": "Hazard Tape Constraints",
    "cardColor": "#F4A261",
    "cardText": "#141414",
    "undersideColor": "#F4A261",
    "previewSymbols": [
      "circle",
      "triangle",
      "cross",
      "square"
    ],
    "mechanicNote": "Chevron hazard tape locks a crease to one fold direction. Follow the arrows.",
    "levels": [
      {
        "id": "c3-01",
        "categoryId": "c3",
        "indexInCategory": 0,
        "code": "01",
        "title": "One-Way Tape",
        "hintText": "HAZARD TAPE LOCKS A CREASE TO ONE DIRECTION — FOLLOW THE CHEVRONS",
        "rows": 2,
        "cols": 3,
        "par": 2,
        "symbols": [
          {
            "r": 0,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 2,
            "type": "cross"
          }
        ],
        "tapes": [
          {
            "orientation": "v",
            "index": 1,
            "allowDir": "right"
          }
        ],
        "pins": []
      },
      {
        "id": "c3-02",
        "categoryId": "c3",
        "indexInCategory": 1,
        "code": "02",
        "title": "Chevron Gate",
        "hintText": "FOLDING AGAINST ONE-WAY TAPE IS BLOCKED — ROUTE AROUND IT",
        "rows": 2,
        "cols": 4,
        "par": 3,
        "symbols": [
          {
            "r": 0,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 3,
            "type": "triangle"
          }
        ],
        "tapes": [
          {
            "orientation": "v",
            "index": 1,
            "allowDir": "right"
          },
          {
            "orientation": "v",
            "index": 3,
            "allowDir": "left"
          }
        ],
        "pins": []
      },
      {
        "id": "c3-03",
        "categoryId": "c3",
        "indexInCategory": 2,
        "code": "03",
        "title": "Locked Spine",
        "rows": 2,
        "cols": 3,
        "par": 2,
        "symbols": [
          {
            "r": 0,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 0,
            "type": "cross"
          }
        ],
        "tapes": [
          {
            "orientation": "v",
            "index": 1,
            "allowDir": "left"
          }
        ],
        "pins": [],
        "hintText": "REMEMBER: TAPED CREASES ON A MOVING FLAP MIRROR WHEN FOLDED OVER"
      },
      {
        "id": "c3-04",
        "categoryId": "c3",
        "indexInCategory": 3,
        "code": "04",
        "title": "Yellow Barrier",
        "rows": 3,
        "cols": 2,
        "par": 2,
        "symbols": [
          {
            "r": 1,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 2,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 1,
            "type": "square"
          },
          {
            "r": 0,
            "c": 0,
            "type": "square"
          }
        ],
        "tapes": [
          {
            "orientation": "v",
            "index": 1,
            "allowDir": "left"
          }
        ],
        "pins": [],
        "hintText": "HAZARD TAPE LOCKS A CREASE TO ONE DIRECTION — FOLLOW THE CHEVRONS"
      },
      {
        "id": "c3-05",
        "categoryId": "c3",
        "indexInCategory": 4,
        "code": "05",
        "title": "Right Turn Only",
        "rows": 3,
        "cols": 3,
        "par": 3,
        "symbols": [
          {
            "r": 1,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 2,
            "type": "square"
          },
          {
            "r": 2,
            "c": 1,
            "type": "square"
          }
        ],
        "tapes": [
          {
            "orientation": "h",
            "index": 1,
            "allowDir": "up"
          }
        ],
        "pins": [],
        "hintText": "FOLDING AGAINST ONE-WAY TAPE IS BLOCKED — ROUTE AROUND IT"
      },
      {
        "id": "c3-06",
        "categoryId": "c3",
        "indexInCategory": 5,
        "code": "06",
        "title": "Tape Margin",
        "rows": 3,
        "cols": 3,
        "par": 3,
        "symbols": [
          {
            "r": 1,
            "c": 1,
            "type": "square"
          },
          {
            "r": 2,
            "c": 2,
            "type": "square"
          },
          {
            "r": 1,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 2,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 0,
            "type": "circle"
          }
        ],
        "tapes": [
          {
            "orientation": "v",
            "index": 1,
            "allowDir": "left"
          },
          {
            "orientation": "h",
            "index": 2,
            "allowDir": "down"
          }
        ],
        "pins": [],
        "hintText": "REMEMBER: TAPED CREASES ON A MOVING FLAP MIRROR WHEN FOLDED OVER"
      },
      {
        "id": "c3-07",
        "categoryId": "c3",
        "indexInCategory": 6,
        "code": "07",
        "title": "Counter Seam",
        "rows": 2,
        "cols": 4,
        "par": 3,
        "symbols": [
          {
            "r": 0,
            "c": 0,
            "type": "square"
          },
          {
            "r": 1,
            "c": 1,
            "type": "square"
          },
          {
            "r": 1,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 3,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 3,
            "type": "circle"
          }
        ],
        "tapes": [
          {
            "orientation": "v",
            "index": 3,
            "allowDir": "right"
          },
          {
            "orientation": "h",
            "index": 1,
            "allowDir": "down"
          }
        ],
        "pins": [],
        "hintText": "HAZARD TAPE LOCKS A CREASE TO ONE DIRECTION — FOLLOW THE CHEVRONS"
      },
      {
        "id": "c3-08",
        "categoryId": "c3",
        "indexInCategory": 7,
        "code": "08",
        "title": "Hazard Axis",
        "rows": 3,
        "cols": 3,
        "par": 3,
        "symbols": [
          {
            "r": 2,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "square"
          },
          {
            "r": 1,
            "c": 0,
            "type": "square"
          }
        ],
        "tapes": [
          {
            "orientation": "h",
            "index": 1,
            "allowDir": "up"
          },
          {
            "orientation": "v",
            "index": 2,
            "allowDir": "left"
          }
        ],
        "pins": [],
        "hintText": "FOLDING AGAINST ONE-WAY TAPE IS BLOCKED — ROUTE AROUND IT"
      },
      {
        "id": "c3-09",
        "categoryId": "c3",
        "indexInCategory": 8,
        "code": "09",
        "title": "Crossed Tape",
        "rows": 3,
        "cols": 4,
        "par": 3,
        "symbols": [
          {
            "r": 1,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 0,
            "type": "triangle"
          }
        ],
        "tapes": [
          {
            "orientation": "v",
            "index": 3,
            "allowDir": "left"
          },
          {
            "orientation": "v",
            "index": 2,
            "allowDir": "right"
          }
        ],
        "pins": [],
        "hintText": "REMEMBER: TAPED CREASES ON A MOVING FLAP MIRROR WHEN FOLDED OVER"
      },
      {
        "id": "c3-10",
        "categoryId": "c3",
        "indexInCategory": 9,
        "code": "10",
        "title": "Guided Press",
        "rows": 3,
        "cols": 4,
        "par": 3,
        "symbols": [
          {
            "r": 2,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "square"
          },
          {
            "r": 1,
            "c": 1,
            "type": "square"
          },
          {
            "r": 2,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 3,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 0,
            "type": "cross"
          }
        ],
        "tapes": [
          {
            "orientation": "h",
            "index": 2,
            "allowDir": "up"
          },
          {
            "orientation": "v",
            "index": 1,
            "allowDir": "right"
          }
        ],
        "pins": [],
        "hintText": "HAZARD TAPE LOCKS A CREASE TO ONE DIRECTION — FOLLOW THE CHEVRONS"
      },
      {
        "id": "c3-11",
        "categoryId": "c3",
        "indexInCategory": 10,
        "code": "11",
        "title": "Forced Fold",
        "rows": 3,
        "cols": 3,
        "par": 4,
        "symbols": [
          {
            "r": 1,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "square"
          },
          {
            "r": 1,
            "c": 2,
            "type": "square"
          },
          {
            "r": 1,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 2,
            "type": "triangle"
          }
        ],
        "tapes": [
          {
            "orientation": "h",
            "index": 1,
            "allowDir": "down"
          },
          {
            "orientation": "h",
            "index": 2,
            "allowDir": "up"
          }
        ],
        "pins": [],
        "hintText": "FOLDING AGAINST ONE-WAY TAPE IS BLOCKED — ROUTE AROUND IT"
      },
      {
        "id": "c3-12",
        "categoryId": "c3",
        "indexInCategory": 11,
        "code": "12",
        "title": "Double Chevron",
        "rows": 3,
        "cols": 4,
        "par": 4,
        "symbols": [
          {
            "r": 0,
            "c": 3,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 2,
            "type": "square"
          },
          {
            "r": 1,
            "c": 3,
            "type": "square"
          },
          {
            "r": 2,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 0,
            "type": "circle"
          }
        ],
        "tapes": [
          {
            "orientation": "v",
            "index": 3,
            "allowDir": "left"
          },
          {
            "orientation": "h",
            "index": 1,
            "allowDir": "up"
          }
        ],
        "pins": [],
        "hintText": "REMEMBER: TAPED CREASES ON A MOVING FLAP MIRROR WHEN FOLDED OVER"
      },
      {
        "id": "c3-13",
        "categoryId": "c3",
        "indexInCategory": 12,
        "code": "13",
        "title": "Strict Register",
        "rows": 4,
        "cols": 3,
        "par": 4,
        "symbols": [
          {
            "r": 0,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 3,
            "c": 1,
            "type": "square"
          },
          {
            "r": 2,
            "c": 1,
            "type": "square"
          },
          {
            "r": 1,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 0,
            "type": "triangle"
          }
        ],
        "tapes": [
          {
            "orientation": "h",
            "index": 1,
            "allowDir": "down"
          },
          {
            "orientation": "h",
            "index": 3,
            "allowDir": "down"
          }
        ],
        "pins": [],
        "hintText": "HAZARD TAPE LOCKS A CREASE TO ONE DIRECTION — FOLLOW THE CHEVRONS"
      },
      {
        "id": "c3-14",
        "categoryId": "c3",
        "indexInCategory": 13,
        "code": "14",
        "title": "Tape Corridor",
        "rows": 3,
        "cols": 4,
        "par": 4,
        "symbols": [
          {
            "r": 2,
            "c": 3,
            "type": "square"
          },
          {
            "r": 1,
            "c": 0,
            "type": "square"
          },
          {
            "r": 0,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 3,
            "type": "cross"
          }
        ],
        "tapes": [
          {
            "orientation": "v",
            "index": 3,
            "allowDir": "left"
          },
          {
            "orientation": "h",
            "index": 1,
            "allowDir": "up"
          },
          {
            "orientation": "v",
            "index": 1,
            "allowDir": "right"
          }
        ],
        "pins": [],
        "hintText": "FOLDING AGAINST ONE-WAY TAPE IS BLOCKED — ROUTE AROUND IT"
      },
      {
        "id": "c3-15",
        "categoryId": "c3",
        "indexInCategory": 14,
        "code": "15",
        "title": "Split Valve",
        "rows": 4,
        "cols": 4,
        "par": 4,
        "symbols": [
          {
            "r": 1,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 2,
            "type": "square"
          },
          {
            "r": 3,
            "c": 2,
            "type": "square"
          },
          {
            "r": 0,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 3,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 3,
            "c": 0,
            "type": "cross"
          }
        ],
        "tapes": [
          {
            "orientation": "v",
            "index": 2,
            "allowDir": "left"
          },
          {
            "orientation": "h",
            "index": 2,
            "allowDir": "up"
          }
        ],
        "pins": [],
        "hintText": "REMEMBER: TAPED CREASES ON A MOVING FLAP MIRROR WHEN FOLDED OVER"
      },
      {
        "id": "c3-16",
        "categoryId": "c3",
        "indexInCategory": 15,
        "code": "16",
        "title": "Sealed Edge",
        "rows": 4,
        "cols": 4,
        "par": 4,
        "symbols": [
          {
            "r": 1,
            "c": 2,
            "type": "square"
          },
          {
            "r": 0,
            "c": 1,
            "type": "square"
          },
          {
            "r": 3,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 3,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 2,
            "c": 3,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 3,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 3,
            "type": "triangle"
          }
        ],
        "tapes": [
          {
            "orientation": "h",
            "index": 2,
            "allowDir": "down"
          },
          {
            "orientation": "h",
            "index": 1,
            "allowDir": "up"
          },
          {
            "orientation": "h",
            "index": 3,
            "allowDir": "up"
          }
        ],
        "pins": [],
        "hintText": "HAZARD TAPE LOCKS A CREASE TO ONE DIRECTION — FOLLOW THE CHEVRONS"
      },
      {
        "id": "c3-17",
        "categoryId": "c3",
        "indexInCategory": 16,
        "code": "17",
        "title": "Asymmetric Lock",
        "rows": 3,
        "cols": 4,
        "par": 5,
        "symbols": [
          {
            "r": 1,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 1,
            "type": "square"
          },
          {
            "r": 1,
            "c": 0,
            "type": "square"
          }
        ],
        "tapes": [
          {
            "orientation": "v",
            "index": 1,
            "allowDir": "right"
          },
          {
            "orientation": "h",
            "index": 2,
            "allowDir": "down"
          }
        ],
        "pins": [],
        "hintText": "FOLDING AGAINST ONE-WAY TAPE IS BLOCKED — ROUTE AROUND IT"
      },
      {
        "id": "c3-18",
        "categoryId": "c3",
        "indexInCategory": 17,
        "code": "18",
        "title": "Press Routing",
        "rows": 4,
        "cols": 3,
        "par": 5,
        "symbols": [
          {
            "r": 2,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 3,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 0,
            "type": "square"
          },
          {
            "r": 2,
            "c": 2,
            "type": "square"
          },
          {
            "r": 2,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 3,
            "c": 0,
            "type": "cross"
          }
        ],
        "tapes": [
          {
            "orientation": "h",
            "index": 3,
            "allowDir": "up"
          },
          {
            "orientation": "v",
            "index": 2,
            "allowDir": "left"
          }
        ],
        "pins": [],
        "hintText": "REMEMBER: TAPED CREASES ON A MOVING FLAP MIRROR WHEN FOLDED OVER"
      },
      {
        "id": "c3-19",
        "categoryId": "c3",
        "indexInCategory": 18,
        "code": "19",
        "title": "Chevron Maze",
        "rows": 4,
        "cols": 4,
        "par": 5,
        "symbols": [
          {
            "r": 3,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 3,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 2,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 0,
            "type": "square"
          },
          {
            "r": 0,
            "c": 2,
            "type": "square"
          },
          {
            "r": 1,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 3,
            "c": 2,
            "type": "circle"
          }
        ],
        "tapes": [
          {
            "orientation": "h",
            "index": 3,
            "allowDir": "up"
          },
          {
            "orientation": "h",
            "index": 2,
            "allowDir": "down"
          },
          {
            "orientation": "v",
            "index": 2,
            "allowDir": "left"
          }
        ],
        "pins": [],
        "hintText": "HAZARD TAPE LOCKS A CREASE TO ONE DIRECTION — FOLLOW THE CHEVRONS"
      },
      {
        "id": "c3-20",
        "categoryId": "c3",
        "indexInCategory": 19,
        "code": "20",
        "title": "Caution Master",
        "rows": 4,
        "cols": 4,
        "par": 5,
        "symbols": [
          {
            "r": 2,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 3,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 3,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 3,
            "c": 3,
            "type": "square"
          },
          {
            "r": 3,
            "c": 0,
            "type": "square"
          },
          {
            "r": 0,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 3,
            "c": 1,
            "type": "circle"
          }
        ],
        "tapes": [
          {
            "orientation": "h",
            "index": 1,
            "allowDir": "down"
          },
          {
            "orientation": "v",
            "index": 2,
            "allowDir": "left"
          },
          {
            "orientation": "v",
            "index": 1,
            "allowDir": "left"
          }
        ],
        "pins": [],
        "hintText": "FOLDING AGAINST ONE-WAY TAPE IS BLOCKED — ROUTE AROUND IT"
      }
    ]
  },
  {
    "id": "c4",
    "code": "04",
    "title": "DUPLEX INK",
    "subtitle": "Flip Plates & Wild Prisms",
    "cardColor": "#1E6B5C",
    "cardText": "#FAF8F5",
    "undersideColor": "#1E6B5C",
    "previewSymbols": [
      "duplex_rb",
      "cross",
      "wild",
      "duplex_br"
    ],
    "mechanicNote": "Duplex ink flips Red ↔ Blue when folded over. Wild Prisms match any symbol.",
    "levels": [
      {
        "id": "c4-01",
        "categoryId": "c4",
        "indexInCategory": 0,
        "code": "01",
        "title": "Duplex Ink",
        "hintText": "DUPLEX INK SYMBOLS FLIP BETWEEN RED AND BLUE WHEN ON THE MOVING FLAP",
        "rows": 2,
        "cols": 2,
        "par": 1,
        "symbols": [
          {
            "r": 0,
            "c": 0,
            "type": "duplex_rb"
          },
          {
            "r": 0,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 1,
            "type": "triangle"
          }
        ],
        "tapes": [],
        "pins": []
      },
      {
        "id": "c4-02",
        "categoryId": "c4",
        "indexInCategory": 1,
        "code": "02",
        "title": "Reverse Plate",
        "rows": 2,
        "cols": 3,
        "par": 2,
        "symbols": [
          {
            "r": 0,
            "c": 1,
            "type": "duplex_br"
          },
          {
            "r": 1,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 0,
            "type": "circle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "WILD PRISM DIAMONDS MATCH ANY INK SYMBOL THEY LAND ON"
      },
      {
        "id": "c4-03",
        "categoryId": "c4",
        "indexInCategory": 2,
        "code": "03",
        "title": "Color Flip",
        "rows": 2,
        "cols": 3,
        "par": 2,
        "symbols": [
          {
            "r": 1,
            "c": 0,
            "type": "duplex_rb"
          },
          {
            "r": 0,
            "c": 0,
            "type": "duplex_br"
          },
          {
            "r": 0,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 2,
            "type": "cross"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "CHOOSE WHICH SIDE FOLDS TO FLIP — OR KEEP — A DUPLEX SYMBOL COLOR"
      },
      {
        "id": "c4-04",
        "categoryId": "c4",
        "indexInCategory": 3,
        "code": "04",
        "title": "Two-Sided Stock",
        "rows": 3,
        "cols": 3,
        "par": 2,
        "symbols": [
          {
            "r": 1,
            "c": 2,
            "type": "duplex_br"
          },
          {
            "r": 2,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 0,
            "type": "circle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "DUPLEX INK SYMBOLS FLIP BETWEEN RED AND BLUE WHEN ON THE MOVING FLAP"
      },
      {
        "id": "c4-05",
        "categoryId": "c4",
        "indexInCategory": 4,
        "code": "05",
        "title": "Backprint Pair",
        "rows": 3,
        "cols": 3,
        "par": 3,
        "symbols": [
          {
            "r": 0,
            "c": 2,
            "type": "duplex_rb"
          },
          {
            "r": 1,
            "c": 1,
            "type": "duplex_br"
          },
          {
            "r": 1,
            "c": 0,
            "type": "square"
          },
          {
            "r": 0,
            "c": 1,
            "type": "square"
          },
          {
            "r": 2,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 2,
            "type": "circle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "WILD PRISM DIAMONDS MATCH ANY INK SYMBOL THEY LAND ON"
      },
      {
        "id": "c4-06",
        "categoryId": "c4",
        "indexInCategory": 5,
        "code": "06",
        "title": "Ink Inversion",
        "rows": 3,
        "cols": 3,
        "par": 3,
        "symbols": [
          {
            "r": 2,
            "c": 0,
            "type": "duplex_rb"
          },
          {
            "r": 0,
            "c": 0,
            "type": "duplex_br"
          },
          {
            "r": 2,
            "c": 1,
            "type": "duplex_rb"
          },
          {
            "r": 1,
            "c": 1,
            "type": "duplex_br"
          },
          {
            "r": 0,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 0,
            "type": "cross"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "CHOOSE WHICH SIDE FOLDS TO FLIP — OR KEEP — A DUPLEX SYMBOL COLOR"
      },
      {
        "id": "c4-07",
        "categoryId": "c4",
        "indexInCategory": 6,
        "code": "07",
        "title": "Mirror Pigment",
        "rows": 2,
        "cols": 4,
        "par": 3,
        "symbols": [
          {
            "r": 1,
            "c": 2,
            "type": "duplex_br"
          },
          {
            "r": 0,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 2,
            "type": "duplex_br"
          },
          {
            "r": 1,
            "c": 3,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 1,
            "type": "square"
          },
          {
            "r": 0,
            "c": 1,
            "type": "square"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "DUPLEX INK SYMBOLS FLIP BETWEEN RED AND BLUE WHEN ON THE MOVING FLAP"
      },
      {
        "id": "c4-08",
        "categoryId": "c4",
        "indexInCategory": 7,
        "code": "08",
        "title": "Wild Prism",
        "hintText": "WILD PRISM DIAMONDS MATCH ANY INK SYMBOL THEY LAND ON",
        "rows": 2,
        "cols": 3,
        "par": 2,
        "symbols": [
          {
            "r": 0,
            "c": 0,
            "type": "wild"
          },
          {
            "r": 0,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 2,
            "type": "wild"
          }
        ],
        "tapes": [],
        "pins": []
      },
      {
        "id": "c4-09",
        "categoryId": "c4",
        "indexInCategory": 8,
        "code": "09",
        "title": "Four-Tone Spark",
        "rows": 3,
        "cols": 3,
        "par": 3,
        "symbols": [
          {
            "r": 1,
            "c": 2,
            "type": "wild"
          },
          {
            "r": 0,
            "c": 1,
            "type": "square"
          },
          {
            "r": 1,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 2,
            "c": 1,
            "type": "cross"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "CHOOSE WHICH SIDE FOLDS TO FLIP — OR KEEP — A DUPLEX SYMBOL COLOR"
      },
      {
        "id": "c4-10",
        "categoryId": "c4",
        "indexInCategory": 9,
        "code": "10",
        "title": "Chromatic Fold",
        "rows": 3,
        "cols": 3,
        "par": 3,
        "symbols": [
          {
            "r": 0,
            "c": 2,
            "type": "duplex_rb"
          },
          {
            "r": 1,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 1,
            "type": "wild"
          },
          {
            "r": 2,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 0,
            "type": "triangle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "DUPLEX INK SYMBOLS FLIP BETWEEN RED AND BLUE WHEN ON THE MOVING FLAP"
      },
      {
        "id": "c4-11",
        "categoryId": "c4",
        "indexInCategory": 10,
        "code": "11",
        "title": "Prism Bridge",
        "rows": 3,
        "cols": 4,
        "par": 3,
        "symbols": [
          {
            "r": 1,
            "c": 3,
            "type": "duplex_rb"
          },
          {
            "r": 2,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 2,
            "c": 2,
            "type": "wild"
          },
          {
            "r": 1,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 3,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 3,
            "type": "triangle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "WILD PRISM DIAMONDS MATCH ANY INK SYMBOL THEY LAND ON"
      },
      {
        "id": "c4-12",
        "categoryId": "c4",
        "indexInCategory": 11,
        "code": "12",
        "title": "Duplex & Prism",
        "rows": 3,
        "cols": 4,
        "par": 3,
        "symbols": [
          {
            "r": 0,
            "c": 2,
            "type": "duplex_rb"
          },
          {
            "r": 1,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 0,
            "type": "duplex_br"
          },
          {
            "r": 2,
            "c": 3,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 3,
            "type": "wild"
          },
          {
            "r": 1,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 2,
            "c": 2,
            "type": "cross"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "CHOOSE WHICH SIDE FOLDS TO FLIP — OR KEEP — A DUPLEX SYMBOL COLOR"
      },
      {
        "id": "c4-13",
        "categoryId": "c4",
        "indexInCategory": 12,
        "code": "13",
        "title": "Overprint Flip",
        "rows": 3,
        "cols": 3,
        "par": 4,
        "symbols": [
          {
            "r": 2,
            "c": 2,
            "type": "duplex_rb"
          },
          {
            "r": 0,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 2,
            "type": "wild"
          },
          {
            "r": 1,
            "c": 2,
            "type": "square"
          },
          {
            "r": 1,
            "c": 1,
            "type": "square"
          },
          {
            "r": 2,
            "c": 0,
            "type": "square"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "DUPLEX INK SYMBOLS FLIP BETWEEN RED AND BLUE WHEN ON THE MOVING FLAP"
      },
      {
        "id": "c4-14",
        "categoryId": "c4",
        "indexInCategory": 13,
        "code": "14",
        "title": "Split Spectrum",
        "rows": 3,
        "cols": 4,
        "par": 4,
        "symbols": [
          {
            "r": 0,
            "c": 0,
            "type": "duplex_rb"
          },
          {
            "r": 2,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 2,
            "type": "duplex_br"
          },
          {
            "r": 0,
            "c": 3,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 2,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 2,
            "type": "triangle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "WILD PRISM DIAMONDS MATCH ANY INK SYMBOL THEY LAND ON"
      },
      {
        "id": "c4-15",
        "categoryId": "c4",
        "indexInCategory": 14,
        "code": "15",
        "title": "Reversible Sheet",
        "rows": 4,
        "cols": 3,
        "par": 4,
        "symbols": [
          {
            "r": 0,
            "c": 1,
            "type": "duplex_br"
          },
          {
            "r": 1,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 2,
            "type": "duplex_rb"
          },
          {
            "r": 2,
            "c": 0,
            "type": "duplex_br"
          },
          {
            "r": 0,
            "c": 0,
            "type": "wild"
          },
          {
            "r": 2,
            "c": 1,
            "type": "square"
          },
          {
            "r": 3,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 3,
            "c": 1,
            "type": "cross"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "CHOOSE WHICH SIDE FOLDS TO FLIP — OR KEEP — A DUPLEX SYMBOL COLOR"
      },
      {
        "id": "c4-16",
        "categoryId": "c4",
        "indexInCategory": 15,
        "code": "16",
        "title": "Dual Register",
        "rows": 4,
        "cols": 4,
        "par": 4,
        "symbols": [
          {
            "r": 3,
            "c": 2,
            "type": "duplex_rb"
          },
          {
            "r": 1,
            "c": 3,
            "type": "duplex_br"
          },
          {
            "r": 0,
            "c": 3,
            "type": "duplex_br"
          },
          {
            "r": 0,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 3,
            "type": "wild"
          },
          {
            "r": 3,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 3,
            "c": 3,
            "type": "cross"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "DUPLEX INK SYMBOLS FLIP BETWEEN RED AND BLUE WHEN ON THE MOVING FLAP"
      },
      {
        "id": "c4-17",
        "categoryId": "c4",
        "indexInCategory": 16,
        "code": "17",
        "title": "Prism Cascade",
        "rows": 3,
        "cols": 4,
        "par": 5,
        "symbols": [
          {
            "r": 1,
            "c": 1,
            "type": "duplex_rb"
          },
          {
            "r": 2,
            "c": 3,
            "type": "duplex_br"
          },
          {
            "r": 1,
            "c": 3,
            "type": "duplex_br"
          },
          {
            "r": 2,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 0,
            "type": "wild"
          },
          {
            "r": 0,
            "c": 2,
            "type": "square"
          },
          {
            "r": 0,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 2,
            "type": "circle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "WILD PRISM DIAMONDS MATCH ANY INK SYMBOL THEY LAND ON"
      },
      {
        "id": "c4-18",
        "categoryId": "c4",
        "indexInCategory": 17,
        "code": "18",
        "title": "Chroma Matrix",
        "rows": 4,
        "cols": 3,
        "par": 5,
        "symbols": [
          {
            "r": 1,
            "c": 1,
            "type": "duplex_rb"
          },
          {
            "r": 2,
            "c": 0,
            "type": "duplex_br"
          },
          {
            "r": 2,
            "c": 1,
            "type": "duplex_br"
          },
          {
            "r": 0,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 3,
            "c": 0,
            "type": "wild"
          },
          {
            "r": 1,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 0,
            "type": "square"
          },
          {
            "r": 3,
            "c": 1,
            "type": "square"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "CHOOSE WHICH SIDE FOLDS TO FLIP — OR KEEP — A DUPLEX SYMBOL COLOR"
      },
      {
        "id": "c4-19",
        "categoryId": "c4",
        "indexInCategory": 18,
        "code": "19",
        "title": "Riso Alchemy",
        "rows": 4,
        "cols": 4,
        "par": 5,
        "symbols": [
          {
            "r": 1,
            "c": 3,
            "type": "duplex_br"
          },
          {
            "r": 3,
            "c": 3,
            "type": "circle"
          },
          {
            "r": 3,
            "c": 2,
            "type": "duplex_rb"
          },
          {
            "r": 2,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 0,
            "type": "wild"
          },
          {
            "r": 2,
            "c": 2,
            "type": "square"
          },
          {
            "r": 3,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 0,
            "type": "triangle"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "DUPLEX INK SYMBOLS FLIP BETWEEN RED AND BLUE WHEN ON THE MOVING FLAP"
      },
      {
        "id": "c4-20",
        "categoryId": "c4",
        "indexInCategory": 19,
        "code": "20",
        "title": "Full Spectrum",
        "rows": 4,
        "cols": 4,
        "par": 5,
        "symbols": [
          {
            "r": 3,
            "c": 0,
            "type": "duplex_rb"
          },
          {
            "r": 0,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 3,
            "type": "duplex_rb"
          },
          {
            "r": 2,
            "c": 3,
            "type": "duplex_br"
          },
          {
            "r": 3,
            "c": 2,
            "type": "wild"
          },
          {
            "r": 1,
            "c": 0,
            "type": "wild"
          },
          {
            "r": 2,
            "c": 0,
            "type": "square"
          },
          {
            "r": 1,
            "c": 3,
            "type": "square"
          },
          {
            "r": 1,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 0,
            "type": "cross"
          }
        ],
        "tapes": [],
        "pins": [],
        "hintText": "WILD PRISM DIAMONDS MATCH ANY INK SYMBOL THEY LAND ON"
      }
    ]
  },
  {
    "id": "c5",
    "code": "05",
    "title": "MASTER ARCHIVE",
    "subtitle": "Pins, Tape & Full Studio",
    "cardColor": "#141414",
    "cardText": "#FAF8F5",
    "undersideColor": "#1D3557",
    "previewSymbols": [
      "square",
      "duplex_rb",
      "wild",
      "circle"
    ],
    "mechanicNote": "Brass Eyelet Pins anchor a tile to the table — combine all studio mechanics.",
    "levels": [
      {
        "id": "c5-01",
        "categoryId": "c5",
        "indexInCategory": 0,
        "code": "01",
        "title": "Brass Eyelet",
        "hintText": "BRASS EYELET PINS ANCHOR A TILE — YOU CAN ONLY FOLD OTHER FLAPS ONTO IT",
        "rows": 2,
        "cols": 3,
        "par": 2,
        "symbols": [
          {
            "r": 0,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 2,
            "type": "cross"
          }
        ],
        "tapes": [],
        "pins": [
          {
            "r": 0,
            "c": 1
          }
        ]
      },
      {
        "id": "c5-02",
        "categoryId": "c5",
        "indexInCategory": 1,
        "code": "02",
        "title": "Pinned Corner",
        "rows": 2,
        "cols": 4,
        "par": 2,
        "symbols": [
          {
            "r": 1,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 2,
            "type": "cross"
          }
        ],
        "tapes": [],
        "pins": [
          {
            "r": 0,
            "c": 3
          }
        ],
        "hintText": "COMBINE PINS, ONE-WAY TAPE, AND DUPLEX INK TO CLEAR THE ARCHIVE SHEET"
      },
      {
        "id": "c5-03",
        "categoryId": "c5",
        "indexInCategory": 2,
        "code": "03",
        "title": "Table Anchor",
        "rows": 3,
        "cols": 3,
        "par": 3,
        "symbols": [
          {
            "r": 0,
            "c": 0,
            "type": "square"
          },
          {
            "r": 2,
            "c": 0,
            "type": "square"
          },
          {
            "r": 0,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 2,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 2,
            "type": "circle"
          }
        ],
        "tapes": [],
        "pins": [
          {
            "r": 1,
            "c": 2
          }
        ],
        "hintText": "USE HINTS OR UNDO TO TEST DIFFERENT FOLD SEQUENCES WITHOUT PENALTY"
      },
      {
        "id": "c5-04",
        "categoryId": "c5",
        "indexInCategory": 3,
        "code": "04",
        "title": "Fixed Margin",
        "rows": 3,
        "cols": 3,
        "par": 3,
        "symbols": [
          {
            "r": 1,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 2,
            "type": "cross"
          }
        ],
        "tapes": [],
        "pins": [
          {
            "r": 1,
            "c": 1
          }
        ],
        "hintText": "BRASS EYELET PINS ANCHOR A TILE — YOU CAN ONLY FOLD OTHER FLAPS ONTO IT"
      },
      {
        "id": "c5-05",
        "categoryId": "c5",
        "indexInCategory": 4,
        "code": "05",
        "title": "Rivet Pivot",
        "rows": 3,
        "cols": 4,
        "par": 3,
        "symbols": [
          {
            "r": 1,
            "c": 3,
            "type": "square"
          },
          {
            "r": 1,
            "c": 0,
            "type": "square"
          },
          {
            "r": 1,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 3,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 2,
            "c": 0,
            "type": "cross"
          }
        ],
        "tapes": [],
        "pins": [
          {
            "r": 2,
            "c": 3
          }
        ],
        "hintText": "COMBINE PINS, ONE-WAY TAPE, AND DUPLEX INK TO CLEAR THE ARCHIVE SHEET"
      },
      {
        "id": "c5-06",
        "categoryId": "c5",
        "indexInCategory": 5,
        "code": "06",
        "title": "Anchored Pair",
        "rows": 3,
        "cols": 4,
        "par": 3,
        "symbols": [
          {
            "r": 1,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 2,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 3,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 0,
            "type": "square"
          },
          {
            "r": 2,
            "c": 3,
            "type": "square"
          }
        ],
        "tapes": [],
        "pins": [
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 0,
            "c": 1
          }
        ],
        "hintText": "USE HINTS OR UNDO TO TEST DIFFERENT FOLD SEQUENCES WITHOUT PENALTY"
      },
      {
        "id": "c5-07",
        "categoryId": "c5",
        "indexInCategory": 6,
        "code": "07",
        "title": "Pin & Chevron",
        "rows": 3,
        "cols": 3,
        "par": 3,
        "symbols": [
          {
            "r": 0,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 2,
            "type": "square"
          },
          {
            "r": 1,
            "c": 0,
            "type": "square"
          },
          {
            "r": 2,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 1,
            "type": "cross"
          }
        ],
        "tapes": [
          {
            "orientation": "h",
            "index": 1,
            "allowDir": "up"
          }
        ],
        "pins": [
          {
            "r": 1,
            "c": 0
          }
        ],
        "hintText": "BRASS EYELET PINS ANCHOR A TILE — YOU CAN ONLY FOLD OTHER FLAPS ONTO IT"
      },
      {
        "id": "c5-08",
        "categoryId": "c5",
        "indexInCategory": 7,
        "code": "08",
        "title": "Locked Anchor",
        "rows": 3,
        "cols": 4,
        "par": 3,
        "symbols": [
          {
            "r": 1,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 3,
            "type": "square"
          },
          {
            "r": 0,
            "c": 3,
            "type": "square"
          },
          {
            "r": 2,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 2,
            "type": "circle"
          }
        ],
        "tapes": [
          {
            "orientation": "v",
            "index": 2,
            "allowDir": "left"
          }
        ],
        "pins": [
          {
            "r": 1,
            "c": 0
          }
        ],
        "hintText": "COMBINE PINS, ONE-WAY TAPE, AND DUPLEX INK TO CLEAR THE ARCHIVE SHEET"
      },
      {
        "id": "c5-09",
        "categoryId": "c5",
        "indexInCategory": 8,
        "code": "09",
        "title": "Duplex Rivet",
        "rows": 3,
        "cols": 3,
        "par": 3,
        "symbols": [
          {
            "r": 2,
            "c": 1,
            "type": "duplex_br"
          },
          {
            "r": 2,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 0,
            "type": "square"
          },
          {
            "r": 1,
            "c": 2,
            "type": "square"
          }
        ],
        "tapes": [],
        "pins": [
          {
            "r": 0,
            "c": 1
          }
        ],
        "hintText": "USE HINTS OR UNDO TO TEST DIFFERENT FOLD SEQUENCES WITHOUT PENALTY"
      },
      {
        "id": "c5-10",
        "categoryId": "c5",
        "indexInCategory": 9,
        "code": "10",
        "title": "Stationary Ink",
        "rows": 3,
        "cols": 4,
        "par": 4,
        "symbols": [
          {
            "r": 2,
            "c": 1,
            "type": "square"
          },
          {
            "r": 0,
            "c": 2,
            "type": "square"
          },
          {
            "r": 2,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 3,
            "type": "circle"
          }
        ],
        "tapes": [
          {
            "orientation": "v",
            "index": 1,
            "allowDir": "left"
          }
        ],
        "pins": [
          {
            "r": 0,
            "c": 3
          }
        ],
        "hintText": "BRASS EYELET PINS ANCHOR A TILE — YOU CAN ONLY FOLD OTHER FLAPS ONTO IT"
      },
      {
        "id": "c5-11",
        "categoryId": "c5",
        "indexInCategory": 10,
        "code": "11",
        "title": "Prism & Pin",
        "rows": 3,
        "cols": 4,
        "par": 4,
        "symbols": [
          {
            "r": 0,
            "c": 1,
            "type": "duplex_rb"
          },
          {
            "r": 0,
            "c": 3,
            "type": "duplex_br"
          },
          {
            "r": 2,
            "c": 0,
            "type": "wild"
          },
          {
            "r": 1,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 2,
            "type": "square"
          },
          {
            "r": 1,
            "c": 2,
            "type": "square"
          },
          {
            "r": 1,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 2,
            "type": "triangle"
          }
        ],
        "tapes": [],
        "pins": [
          {
            "r": 0,
            "c": 3
          }
        ],
        "hintText": "COMBINE PINS, ONE-WAY TAPE, AND DUPLEX INK TO CLEAR THE ARCHIVE SHEET"
      },
      {
        "id": "c5-12",
        "categoryId": "c5",
        "indexInCategory": 11,
        "code": "12",
        "title": "Weimar Press",
        "rows": 3,
        "cols": 4,
        "par": 4,
        "symbols": [
          {
            "r": 0,
            "c": 2,
            "type": "duplex_rb"
          },
          {
            "r": 1,
            "c": 3,
            "type": "duplex_br"
          },
          {
            "r": 2,
            "c": 3,
            "type": "square"
          },
          {
            "r": 1,
            "c": 2,
            "type": "square"
          },
          {
            "r": 0,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "triangle"
          }
        ],
        "tapes": [
          {
            "orientation": "h",
            "index": 2,
            "allowDir": "up"
          }
        ],
        "pins": [
          {
            "r": 0,
            "c": 3
          }
        ],
        "hintText": "USE HINTS OR UNDO TO TEST DIFFERENT FOLD SEQUENCES WITHOUT PENALTY"
      },
      {
        "id": "c5-13",
        "categoryId": "c5",
        "indexInCategory": 12,
        "code": "13",
        "title": "Dessau Fold",
        "rows": 4,
        "cols": 3,
        "par": 4,
        "symbols": [
          {
            "r": 3,
            "c": 0,
            "type": "wild"
          },
          {
            "r": 2,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 0,
            "c": 2,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 1,
            "type": "square"
          },
          {
            "r": 3,
            "c": 2,
            "type": "square"
          },
          {
            "r": 1,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 2,
            "type": "circle"
          }
        ],
        "tapes": [
          {
            "orientation": "h",
            "index": 3,
            "allowDir": "down"
          },
          {
            "orientation": "h",
            "index": 2,
            "allowDir": "up"
          }
        ],
        "pins": [
          {
            "r": 0,
            "c": 1
          }
        ],
        "hintText": "BRASS EYELET PINS ANCHOR A TILE — YOU CAN ONLY FOLD OTHER FLAPS ONTO IT"
      },
      {
        "id": "c5-14",
        "categoryId": "c5",
        "indexInCategory": 13,
        "code": "14",
        "title": "Kandinsky Grid",
        "rows": 4,
        "cols": 4,
        "par": 4,
        "symbols": [
          {
            "r": 2,
            "c": 1,
            "type": "duplex_br"
          },
          {
            "r": 3,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 2,
            "type": "wild"
          },
          {
            "r": 3,
            "c": 1,
            "type": "square"
          },
          {
            "r": 2,
            "c": 3,
            "type": "square"
          },
          {
            "r": 1,
            "c": 1,
            "type": "square"
          },
          {
            "r": 2,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 0,
            "type": "triangle"
          }
        ],
        "tapes": [
          {
            "orientation": "v",
            "index": 3,
            "allowDir": "left"
          }
        ],
        "pins": [
          {
            "r": 2,
            "c": 0
          }
        ],
        "hintText": "COMBINE PINS, ONE-WAY TAPE, AND DUPLEX INK TO CLEAR THE ARCHIVE SHEET"
      },
      {
        "id": "c5-15",
        "categoryId": "c5",
        "indexInCategory": 14,
        "code": "15",
        "title": "Moholy Study",
        "rows": 4,
        "cols": 4,
        "par": 4,
        "symbols": [
          {
            "r": 2,
            "c": 0,
            "type": "duplex_rb"
          },
          {
            "r": 0,
            "c": 1,
            "type": "duplex_br"
          },
          {
            "r": 0,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 3,
            "c": 0,
            "type": "square"
          },
          {
            "r": 2,
            "c": 3,
            "type": "square"
          }
        ],
        "tapes": [
          {
            "orientation": "v",
            "index": 3,
            "allowDir": "right"
          },
          {
            "orientation": "h",
            "index": 1,
            "allowDir": "up"
          }
        ],
        "pins": [
          {
            "r": 1,
            "c": 0
          }
        ],
        "hintText": "USE HINTS OR UNDO TO TEST DIFFERENT FOLD SEQUENCES WITHOUT PENALTY"
      },
      {
        "id": "c5-16",
        "categoryId": "c5",
        "indexInCategory": 15,
        "code": "16",
        "title": "Albers Layer",
        "rows": 4,
        "cols": 4,
        "par": 5,
        "symbols": [
          {
            "r": 0,
            "c": 2,
            "type": "duplex_br"
          },
          {
            "r": 2,
            "c": 3,
            "type": "circle"
          },
          {
            "r": 3,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 2,
            "c": 1,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 3,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 1,
            "c": 1,
            "type": "triangle"
          }
        ],
        "tapes": [
          {
            "orientation": "h",
            "index": 1,
            "allowDir": "down"
          }
        ],
        "pins": [
          {
            "r": 1,
            "c": 3
          }
        ],
        "hintText": "BRASS EYELET PINS ANCHOR A TILE — YOU CAN ONLY FOLD OTHER FLAPS ONTO IT"
      },
      {
        "id": "c5-17",
        "categoryId": "c5",
        "indexInCategory": 16,
        "code": "17",
        "title": "Exhibition Print",
        "rows": 4,
        "cols": 4,
        "par": 5,
        "symbols": [
          {
            "r": 0,
            "c": 1,
            "type": "duplex_br"
          },
          {
            "r": 0,
            "c": 2,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 0,
            "type": "wild"
          },
          {
            "r": 3,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 0,
            "type": "square"
          },
          {
            "r": 1,
            "c": 1,
            "type": "square"
          },
          {
            "r": 0,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 2,
            "c": 1,
            "type": "cross"
          }
        ],
        "tapes": [
          {
            "orientation": "v",
            "index": 1,
            "allowDir": "right"
          },
          {
            "orientation": "v",
            "index": 3,
            "allowDir": "left"
          }
        ],
        "pins": [
          {
            "r": 2,
            "c": 2
          }
        ],
        "hintText": "COMBINE PINS, ONE-WAY TAPE, AND DUPLEX INK TO CLEAR THE ARCHIVE SHEET"
      },
      {
        "id": "c5-18",
        "categoryId": "c5",
        "indexInCategory": 17,
        "code": "18",
        "title": "Curator Proof",
        "rows": 4,
        "cols": 4,
        "par": 5,
        "symbols": [
          {
            "r": 3,
            "c": 1,
            "type": "duplex_rb"
          },
          {
            "r": 0,
            "c": 0,
            "type": "duplex_br"
          },
          {
            "r": 0,
            "c": 2,
            "type": "wild"
          },
          {
            "r": 1,
            "c": 0,
            "type": "cross"
          },
          {
            "r": 3,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 3,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 2,
            "type": "square"
          },
          {
            "r": 3,
            "c": 3,
            "type": "square"
          },
          {
            "r": 2,
            "c": 0,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 1,
            "type": "triangle"
          }
        ],
        "tapes": [
          {
            "orientation": "v",
            "index": 3,
            "allowDir": "left"
          }
        ],
        "pins": [
          {
            "r": 3,
            "c": 1
          }
        ],
        "hintText": "USE HINTS OR UNDO TO TEST DIFFERENT FOLD SEQUENCES WITHOUT PENALTY"
      },
      {
        "id": "c5-19",
        "categoryId": "c5",
        "indexInCategory": 18,
        "code": "19",
        "title": "Grand Archive",
        "rows": 4,
        "cols": 4,
        "par": 5,
        "symbols": [
          {
            "r": 1,
            "c": 0,
            "type": "duplex_br"
          },
          {
            "r": 0,
            "c": 3,
            "type": "circle"
          },
          {
            "r": 2,
            "c": 0,
            "type": "duplex_rb"
          },
          {
            "r": 2,
            "c": 2,
            "type": "duplex_br"
          },
          {
            "r": 1,
            "c": 3,
            "type": "wild"
          },
          {
            "r": 2,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 3,
            "c": 3,
            "type": "cross"
          },
          {
            "r": 3,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 3,
            "c": 2,
            "type": "triangle"
          }
        ],
        "tapes": [
          {
            "orientation": "v",
            "index": 3,
            "allowDir": "left"
          },
          {
            "orientation": "h",
            "index": 1,
            "allowDir": "up"
          }
        ],
        "pins": [
          {
            "r": 0,
            "c": 0
          }
        ],
        "hintText": "BRASS EYELET PINS ANCHOR A TILE — YOU CAN ONLY FOLD OTHER FLAPS ONTO IT"
      },
      {
        "id": "c5-20",
        "categoryId": "c5",
        "indexInCategory": 19,
        "code": "20",
        "title": "Bauhaus Master",
        "hintText": "COMBINE PINS, ONE-WAY TAPE, AND DUPLEX INK TO CLEAR THE ARCHIVE SHEET",
        "rows": 3,
        "cols": 4,
        "par": 4,
        "symbols": [
          {
            "r": 0,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 1,
            "c": 0,
            "type": "circle"
          },
          {
            "r": 0,
            "c": 1,
            "type": "cross"
          },
          {
            "r": 0,
            "c": 2,
            "type": "cross"
          },
          {
            "r": 1,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 1,
            "type": "triangle"
          },
          {
            "r": 2,
            "c": 2,
            "type": "square"
          },
          {
            "r": 2,
            "c": 3,
            "type": "square"
          }
        ],
        "tapes": [
          {
            "orientation": "v",
            "index": 3,
            "allowDir": "left"
          },
          {
            "orientation": "h",
            "index": 1,
            "allowDir": "down"
          }
        ],
        "pins": [
          {
            "r": 1,
            "c": 1
          }
        ]
      }
    ]
  }
];

export function getCategoryById(id: string): CategoryDef {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}

export function getLevelById(id: string) {
  for (const cat of CATEGORIES) {
    const found = cat.levels.find((l) => l.id === id);
    if (found) return { category: cat, level: found };
  }
  return { category: CATEGORIES[0], level: CATEGORIES[0].levels[0] };
}
