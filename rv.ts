// start 12:45
//
export class RV {
  value: unknown;
  constructor(value: unknown) {
    this.value = value;
  }

  static normalize(array) {
    let lastV;
    let values = 0;
    const r = [];
    for (let i = array.length - 1; i >= 0; i--) {
      const v = array[i];
      r[i] = v;
      if (v === lastV) {
        r[i] = null;
      }
      if (RV.isDefined(r[i])) {
        lastV = v;
        values++;
      }
    }
    return values === 1 ? lastV : r;
  }

  size() {
    return Array.isArray(this.value) ? this.value.length : 1;
  }

  values(size = 0) {
    const array = toArray(this.value);
    if (!size) size = array.length;
    const def = RV.isDefined;

    const rValues = [];
    let lastRightV;
    for (let i = array.length - 1; i >= 0; i--) {
      const v = array[i];
      if (def(v)) {
        rValues[i] = v;
        lastRightV = v;
      } else {
        if (def(lastRightV)) {
          rValues[i] = lastRightV;
        }
      }
    }

    let lastLeftV;
    const result = [];
    for (let i = 0; i < size; i++) {
      const v = array[i];
      if (def(v)) {
        result[i] = v;
        lastLeftV = v;
      } else {
        if (def(rValues[i])) result[i] = rValues[i];
        else result[i] = lastLeftV;
      }
    }

    return result;
  }

  map(rv?: RV, fn) {
    if (!rv) rv = new RV([]);
    const size = Math.max(this.size(), rv.size());
    const l = this.values(size);
    const r = rv.values(size);
    return RV.normalize(new Array(size).fill(0).map((_, i) => fn(l[i], r[i])));
  }

  static isDefined(v) {
    return v !== undefined && v !== null;
  }
}

function toArray(v) {
  return Array.isArray(v) ? v : [v];
}

export function getContainerWidth(containerMargin: RV, isSnappedToEdge: RV) {
  return containerMargin.map(isSnappedToEdge, (cM, isSnapped) => {
    if (isSnapped) {
      return "100%";
    }

    return `calc(100% - ${cM / 2}px)`;
  });
}

export function maxValueKey(rv: RV) {
  return rv.map(undefined, (obj) => {
    return Object.entries(obj).reduce(
      (acc, current) => {
        return current[1] > acc[1] ? current : acc;
      },
      [undefined, Number.MIN_VALUE]
    )[0];
  });
}
