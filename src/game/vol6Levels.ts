import { CategoryDef } from './types';

// 100% BFS-verified Vol. 06 Pressroom levels (Perforated Tear Lines, Carbon Copy Ink, Locked Creases)
export const VOL6_CATEGORY: CategoryDef = {
  id: 'c6',
  code: '06',
  title: 'PRESSROOM',
  subtitle: 'Tear, Carbon & Locks',
  cardColor: '#7C2D12',
  cardText: '#FAF8F5',
  undersideColor: '#7C2D12',
  previewSymbols: ['carbon_circle', 'carbon_cross', 'triangle', 'square'],
  mechanicNote:
    'Master perforated tear lines, 2× carbon copy ink stamping, and symbol-keyed locked creases.',
  levels: [
  {
    "id": "c6-01",
    "categoryId": "c6",
    "indexInCategory": 0,
    "code": "01",
    "title": "Perforated Margin",
    "hintText": "FOLDING ACROSS A RED SCISSOR LINE TEARS OFF & DISCARDS THE MOVING FLAP",
    "rows": 2,
    "cols": 3,
    "par": 2,
    "symbols": [
      {
        "r": 1,
        "c": 2,
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
      }
    ],
    "tapes": [],
    "pins": [],
    "perforations": [
      {
        "orientation": "v",
        "index": 1
      }
    ],
    "locks": []
  },
  {
    "id": "c6-02",
    "categoryId": "c6",
    "indexInCategory": 1,
    "code": "02",
    "title": "Trimmed Proof",
    "hintText": "TEAR OFF THE UNPAIRED STRIP, THEN FOLD THE REMAINING SYMBOLS TOGETHER",
    "rows": 3,
    "cols": 3,
    "par": 2,
    "symbols": [
      {
        "r": 2,
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
      },
      {
        "r": 2,
        "c": 2,
        "type": "circle"
      }
    ],
    "tapes": [],
    "pins": [],
    "perforations": [
      {
        "orientation": "v",
        "index": 2
      }
    ],
    "locks": []
  },
  {
    "id": "c6-03",
    "categoryId": "c6",
    "indexInCategory": 2,
    "code": "03",
    "title": "Deckle Edge",
    "hintText": "SAVE MATCHING SYMBOLS BEFORE TEARING — DISCARDED INK IS GONE FOR GOOD",
    "rows": 3,
    "cols": 3,
    "par": 3,
    "symbols": [
      {
        "r": 1,
        "c": 1,
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
        "type": "square"
      }
    ],
    "tapes": [],
    "pins": [],
    "perforations": [
      {
        "orientation": "v",
        "index": 2
      }
    ],
    "locks": []
  },
  {
    "id": "c6-04",
    "categoryId": "c6",
    "indexInCategory": 3,
    "code": "04",
    "title": "Stub & Folio",
    "hintText": "A BRASS PIN KEEPS ITS HALF ANCHORED — YOU CAN ONLY TEAR THE FREE FLAP",
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
        "r": 2,
        "c": 2,
        "type": "circle"
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
        "r": 0,
        "c": 0,
        "type": "cross"
      }
    ],
    "tapes": [],
    "pins": [
      {
        "r": 2,
        "c": 2
      }
    ],
    "perforations": [
      {
        "orientation": "v",
        "index": 1
      }
    ],
    "locks": []
  },
  {
    "id": "c6-05",
    "categoryId": "c6",
    "indexInCategory": 4,
    "code": "05",
    "title": "Guillotine Cut",
    "hintText": "FOLD STRAY SYMBOLS ONTO THE PERFORATED STRIP BEFORE TEARING IT AWAY",
    "rows": 3,
    "cols": 4,
    "par": 3,
    "symbols": [
      {
        "r": 1,
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
        "c": 3,
        "type": "circle"
      },
      {
        "r": 0,
        "c": 0,
        "type": "circle"
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
      }
    ],
    "tapes": [],
    "pins": [],
    "perforations": [
      {
        "orientation": "v",
        "index": 1
      }
    ],
    "locks": []
  },
  {
    "id": "c6-06",
    "categoryId": "c6",
    "indexInCategory": 5,
    "code": "06",
    "title": "Clean Offcut",
    "hintText": "SEQUENCE YOUR FOLDS AND TEAR LINE CAREFULLY TO CLEAR EVERY INK",
    "rows": 3,
    "cols": 4,
    "par": 4,
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
        "r": 1,
        "c": 3,
        "type": "square"
      },
      {
        "r": 1,
        "c": 1,
        "type": "square"
      },
      {
        "r": 0,
        "c": 1,
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
      }
    ],
    "tapes": [
      {
        "orientation": "h",
        "index": 1,
        "allowDir": "down"
      }
    ],
    "pins": [],
    "perforations": [
      {
        "orientation": "v",
        "index": 1
      }
    ],
    "locks": []
  },
  {
    "id": "c6-07",
    "categoryId": "c6",
    "indexInCategory": 6,
    "code": "07",
    "title": "Carbon Sheet",
    "hintText": "FOLD A 2× CARBON SYMBOL ONTO A BLANK TILE TO STAMP A GHOST COPY UNDERNEATH",
    "rows": 2,
    "cols": 4,
    "par": 3,
    "symbols": [
      {
        "r": 1,
        "c": 0,
        "type": "carbon_cross"
      },
      {
        "r": 1,
        "c": 1,
        "type": "cross"
      },
      {
        "r": 0,
        "c": 1,
        "type": "cross"
      }
    ],
    "tapes": [],
    "pins": [],
    "perforations": [],
    "locks": []
  },
  {
    "id": "c6-08",
    "categoryId": "c6",
    "indexInCategory": 7,
    "code": "08",
    "title": "Ghost Underprint",
    "hintText": "MATCH THE TOP INK FIRST TO REVEAL THE CARBON GHOST STAMPED BENEATH IT",
    "rows": 3,
    "cols": 3,
    "par": 3,
    "symbols": [
      {
        "r": 1,
        "c": 0,
        "type": "carbon_cross"
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
        "c": 2,
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
    "perforations": [],
    "locks": []
  },
  {
    "id": "c6-09",
    "categoryId": "c6",
    "indexInCategory": 8,
    "code": "09",
    "title": "Duplicate Plate",
    "hintText": "DON’T MATCH CARBON INK TOO EARLY — PRESS IT ONTO BLANK PAPER FIRST!",
    "rows": 3,
    "cols": 4,
    "par": 3,
    "symbols": [
      {
        "r": 2,
        "c": 3,
        "type": "carbon_square"
      },
      {
        "r": 1,
        "c": 3,
        "type": "square"
      },
      {
        "r": 0,
        "c": 0,
        "type": "square"
      },
      {
        "r": 0,
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
    "perforations": [],
    "locks": []
  },
  {
    "id": "c6-10",
    "categoryId": "c6",
    "indexInCategory": 9,
    "code": "10",
    "title": "Manifold Press",
    "hintText": "USE THE BLANK SPACE TO MULTIPLY CARBON INK FOR ITS TWO MATCHING TWINS",
    "rows": 3,
    "cols": 4,
    "par": 4,
    "symbols": [
      {
        "r": 1,
        "c": 0,
        "type": "carbon_triangle"
      },
      {
        "r": 0,
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
        "c": 0,
        "type": "cross"
      },
      {
        "r": 2,
        "c": 0,
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
      }
    ],
    "tapes": [],
    "pins": [],
    "perforations": [],
    "locks": []
  },
  {
    "id": "c6-11",
    "categoryId": "c6",
    "indexInCategory": 10,
    "code": "11",
    "title": "Pinned Stencil",
    "hintText": "FOLD A BLANK FLAP OVER A PINNED CARBON SYMBOL TO STAMP A GHOST LAYER",
    "rows": 3,
    "cols": 4,
    "par": 4,
    "symbols": [
      {
        "r": 1,
        "c": 2,
        "type": "carbon_triangle"
      },
      {
        "r": 0,
        "c": 0,
        "type": "triangle"
      },
      {
        "r": 2,
        "c": 3,
        "type": "triangle"
      },
      {
        "r": 2,
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
    "pins": [
      {
        "r": 2,
        "c": 3
      }
    ],
    "perforations": [],
    "locks": []
  },
  {
    "id": "c6-12",
    "categoryId": "c6",
    "indexInCategory": 11,
    "code": "12",
    "title": "Double Impression",
    "hintText": "COMBINE ONE-WAY TAPE WITH CARBON COPY STAMPING TO CLEAR ALL SYMBOLS",
    "rows": 4,
    "cols": 4,
    "par": 4,
    "symbols": [
      {
        "r": 0,
        "c": 0,
        "type": "carbon_circle"
      },
      {
        "r": 3,
        "c": 3,
        "type": "circle"
      },
      {
        "r": 3,
        "c": 2,
        "type": "circle"
      },
      {
        "r": 2,
        "c": 1,
        "type": "triangle"
      },
      {
        "r": 3,
        "c": 1,
        "type": "triangle"
      },
      {
        "r": 2,
        "c": 0,
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
        "orientation": "v",
        "index": 2,
        "allowDir": "left"
      }
    ],
    "pins": [],
    "perforations": [],
    "locks": []
  },
  {
    "id": "c6-13",
    "categoryId": "c6",
    "indexInCategory": 12,
    "code": "13",
    "title": "Keyed Crease",
    "hintText": "CLEAR EVERY SYMBOL MATCHING THE PADLOCK ICON TO UNLOCK THE CREASE",
    "rows": 2,
    "cols": 4,
    "par": 2,
    "symbols": [
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
        "r": 0,
        "c": 0,
        "type": "circle"
      },
      {
        "r": 0,
        "c": 1,
        "type": "circle"
      }
    ],
    "tapes": [],
    "pins": [],
    "perforations": [],
    "locks": [
      {
        "orientation": "v",
        "index": 1,
        "keySymbol": "triangle"
      }
    ]
  },
  {
    "id": "c6-14",
    "categoryId": "c6",
    "indexInCategory": 13,
    "code": "14",
    "title": "Gatekeeper Fold",
    "hintText": "SOLVE THE KEY INK FIRST SO THE LOCKED SPINE SNAPS OPEN",
    "rows": 3,
    "cols": 3,
    "par": 3,
    "symbols": [
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
        "r": 2,
        "c": 2,
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
    "perforations": [],
    "locks": [
      {
        "orientation": "v",
        "index": 1,
        "keySymbol": "cross"
      }
    ]
  },
  {
    "id": "c6-15",
    "categoryId": "c6",
    "indexInCategory": 14,
    "code": "15",
    "title": "Vaulted Margin",
    "hintText": "UNLOCK THE PADLOCK CREASE BEFORE FOLDING THE FINAL PAIR TOGETHER",
    "rows": 3,
    "cols": 4,
    "par": 3,
    "symbols": [
      {
        "r": 0,
        "c": 3,
        "type": "triangle"
      },
      {
        "r": 2,
        "c": 3,
        "type": "triangle"
      },
      {
        "r": 2,
        "c": 2,
        "type": "square"
      },
      {
        "r": 1,
        "c": 3,
        "type": "square"
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
    "perforations": [],
    "locks": [
      {
        "orientation": "v",
        "index": 3,
        "keySymbol": "triangle"
      }
    ]
  },
  {
    "id": "c6-16",
    "categoryId": "c6",
    "indexInCategory": 15,
    "code": "16",
    "title": "Twin Latches",
    "hintText": "EACH PADLOCK OPENS THE INSTANT ITS KEY SYMBOL VANISHES FROM THE SHEET",
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
        "r": 0,
        "c": 2,
        "type": "triangle"
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
      }
    ],
    "tapes": [],
    "pins": [],
    "perforations": [],
    "locks": [
      {
        "orientation": "v",
        "index": 1,
        "keySymbol": "triangle"
      },
      {
        "orientation": "v",
        "index": 2,
        "keySymbol": "cross"
      }
    ]
  },
  {
    "id": "c6-17",
    "categoryId": "c6",
    "indexInCategory": 16,
    "code": "17",
    "title": "Chained Proof",
    "hintText": "CLEAR LOCKS IN SEQUENCE WHILE RESPECTING THE BRASS EYELET PIN",
    "rows": 4,
    "cols": 4,
    "par": 4,
    "symbols": [
      {
        "r": 0,
        "c": 1,
        "type": "triangle"
      },
      {
        "r": 1,
        "c": 2,
        "type": "triangle"
      },
      {
        "r": 3,
        "c": 1,
        "type": "cross"
      },
      {
        "r": 3,
        "c": 3,
        "type": "cross"
      },
      {
        "r": 0,
        "c": 2,
        "type": "square"
      },
      {
        "r": 0,
        "c": 3,
        "type": "square"
      }
    ],
    "tapes": [],
    "pins": [
      {
        "r": 3,
        "c": 1
      }
    ],
    "perforations": [],
    "locks": [
      {
        "orientation": "v",
        "index": 3,
        "keySymbol": "triangle"
      }
    ]
  },
  {
    "id": "c6-18",
    "categoryId": "c6",
    "indexInCategory": 17,
    "code": "18",
    "title": "Tear the Latch",
    "hintText": "TEARING OFF A KEY SYMBOL CAN SNAP A LOCKED CREASE OPEN IMMEDIATELY",
    "rows": 3,
    "cols": 4,
    "par": 3,
    "symbols": [
      {
        "r": 0,
        "c": 3,
        "type": "square"
      },
      {
        "r": 1,
        "c": 3,
        "type": "square"
      },
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
        "type": "circle"
      }
    ],
    "tapes": [],
    "pins": [],
    "perforations": [
      {
        "orientation": "v",
        "index": 2
      }
    ],
    "locks": [
      {
        "orientation": "h",
        "index": 2,
        "keySymbol": "square"
      }
    ]
  },
  {
    "id": "c6-19",
    "categoryId": "c6",
    "indexInCategory": 18,
    "code": "19",
    "title": "Carbon Keyhole",
    "hintText": "STAMP CARBON INK ONTO A BLANK TILE AND UNLOCK THE PADLOCK CREASE",
    "rows": 3,
    "cols": 4,
    "par": 4,
    "symbols": [
      {
        "r": 0,
        "c": 2,
        "type": "carbon_cross"
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
    "perforations": [],
    "locks": [
      {
        "orientation": "v",
        "index": 1,
        "keySymbol": "square"
      }
    ]
  },
  {
    "id": "c6-20",
    "categoryId": "c6",
    "indexInCategory": 19,
    "code": "20",
    "title": "Master Pressroom",
    "hintText": "TEAR, CARBON COPY, AND LOCKED CREASE — ORCHESTRATE THE FULL PRESSROOM",
    "rows": 4,
    "cols": 4,
    "par": 4,
    "symbols": [
      {
        "r": 1,
        "c": 0,
        "type": "carbon_square"
      },
      {
        "r": 1,
        "c": 2,
        "type": "square"
      },
      {
        "r": 1,
        "c": 3,
        "type": "square"
      },
      {
        "r": 3,
        "c": 0,
        "type": "triangle"
      },
      {
        "r": 3,
        "c": 3,
        "type": "triangle"
      },
      {
        "r": 3,
        "c": 2,
        "type": "circle"
      }
    ],
    "tapes": [],
    "pins": [],
    "perforations": [
      {
        "orientation": "h",
        "index": 3
      }
    ],
    "locks": [
      {
        "orientation": "h",
        "index": 2,
        "keySymbol": "triangle"
      }
    ]
  }
],
};
