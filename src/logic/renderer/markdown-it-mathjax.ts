/**
 * mathjax preprocess
 *
 * markdown ==> html for mathjax
 *
 * $\frac{a}{b}$  ==>  \( \frac{a}{b} \)
 * $$ \frac{a}{b} $$  ==>  \[ \frac{a}{b} \]
 *
 * Reference:
 *   https://github.com/classeur/markdown-it-mathjax.git
 */
'use strict';

function math(state: any, silent: any) {
  let startMathPos = state.pos;
  if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
    return false;
  }
  const match = state.src.slice(++startMathPos).match(/^(?:\\\[|\\\(|begin\{([^}]*)\})/);
  if (!match) {
    return false;
  }
  startMathPos += match[0].length;
  let type, endMarker: any, includeMarkers;
  if (match[0] === '\\[') {
    type = 'display_math';
    endMarker = '\\\\]';
  } else if (match[0] === '\\(') {
    type = 'inline_math';
    endMarker = '\\\\)';
  } else if (match[1]) {
    type = 'math';
    endMarker = '\\end{' + match[1] + '}';
    includeMarkers = true;
  }
  const endMarkerPos = state.src.indexOf(endMarker, startMathPos);
  if (endMarkerPos === -1) {
    return false;
  }
  const nextPos = endMarkerPos + endMarker.length;
  if (!silent) {
    const token = state.push(type, '', 0);
    token.content = includeMarkers ? state.src.slice(state.pos, nextPos) : state.src.slice(startMathPos, endMarkerPos);
  }
  state.pos = nextPos;
  return true;
}

function texMath(state: any, silent: any) {
  let startMathPos = state.pos;
  if (state.src.charCodeAt(startMathPos) !== 0x24 /* $ */) {
    return false;
  }

  // Parse tex math according to http://pandoc.org/README.html#math
  let endMarker = '$';
  const afterStartMarker = state.src.charCodeAt(++startMathPos);
  if (afterStartMarker === 0x24 /* $ */) {
    endMarker = '$$';
    if (state.src.charCodeAt(++startMathPos) === 0x24 /* $ */) {
      // 3 markers are too much
      return false;
    }
  } else {
    // Skip if opening $ is succeeded by a space character
    if (afterStartMarker === 0x20 /* space */ || afterStartMarker === 0x09 /* \t */ || afterStartMarker === 0x0a /* \n */) {
      return false;
    }
  }
  const endMarkerPos = state.src.indexOf(endMarker, startMathPos);
  if (endMarkerPos === -1) {
    return false;
  }
  if (state.src.charCodeAt(endMarkerPos - 1) === 0x5c /* \ */) {
    return false;
  }
  const nextPos = endMarkerPos + endMarker.length;
  if (endMarker.length === 1) {
    // Skip if $ is preceded by a space character
    const beforeEndMarker = state.src.charCodeAt(endMarkerPos - 1);
    if (beforeEndMarker === 0x20 /* space */ || beforeEndMarker === 0x09 /* \t */ || beforeEndMarker === 0x0a /* \n */) {
      return false;
    }
    // Skip if closing $ is succeeded by a digit (eg $5 $10 ...)
    const suffix = state.src.charCodeAt(nextPos);
    if (suffix >= 0x30 && suffix < 0x3a) {
      return false;
    }
  }

  if (!silent) {
    const token = state.push(endMarker.length === 1 ? 'inline_math' : 'display_math', '', 0);
    token.content = state.src.slice(startMathPos, endMarkerPos);
  }
  state.pos = nextPos;
  return true;
}

function escapeHtml(html: any) {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/\u00a0/g, ' ');
}

function extend(options: any, defaults: any) {
  return Object.keys(defaults).reduce(function (result, key) {
    if (result[key] === undefined) {
      result[key] = defaults[key];
    }
    return result;
  }, options);
}

const mapping: any = {
  math: 'Math',
  inline_math: 'InlineMath',
  display_math: 'DisplayMath'
};

export function get(options: any = null) {
  const defaults = {
    beforeMath: '',
    afterMath: '',
    beforeInlineMath: '\\(',
    afterInlineMath: '\\)',
    beforeDisplayMath: '\\[',
    afterDisplayMath: '\\]'
  };
  options = extend(options || {}, defaults);

  return function (md: any) {
    md.inline.ruler.before('escape', 'math', math);
    md.inline.ruler.push('texMath', texMath);

    Object.keys(mapping).forEach(function (key) {
      const before = options['before' + mapping[key]];
      const after = options['after' + mapping[key]];
      md.renderer.rules[key] = function (tokens: any, idx: any, opts: any, env: any) {
        // hasMath
        if (env) env.hasMath = true;
        return before + escapeHtml(tokens[idx].content) + after;
      };
    });
  };
}
