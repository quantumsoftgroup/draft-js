/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getSafeBodyFromHTML
 * @format
 * @flow
 */

'use strict';

var UserAgent = require('UserAgent');

const invariant = require('invariant');

var isOldIE = UserAgent.isBrowser('IE <= 9');

// Provides a dom node that will not execute scripts
// https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation.createHTMLDocument
// https://developer.mozilla.org/en-US/Add-ons/Code_snippets/HTML_to_DOM

function getSafeBodyFromHTML(html: string): ?Element {
  var doc;
  var root = null;
  // Provides a safe context
  if (
    !isOldIE &&
    document.implementation &&
    document.implementation.createHTMLDocument
  ) {
    doc = document.implementation.createHTMLDocument('foo');
    invariant(doc.documentElement, 'Missing doc.documentElement');
    doc.documentElement.innerHTML = html;
    root = doc.getElementsByTagName('body')[0];
    if (root.childNodes.length > 4) {
      var sf = root.childNodes[1];
      var ef = root.childNodes[root.childNodes.length - 2];
      if (sf.nodeType == Node.COMMENT_NODE && ef.nodeType == Node.COMMENT_NODE && sf.nodeValue == "StartFragment" && ef.nodeValue=="EndFragment") {
          // remove first two nodes and last two nodes
          var st = root.childNodes[0];
          var et = root.childNodes[root.childNodes.length - 1];
          st.remove();
          sf.remove();
          ef.remove();
          et.remove();
      }
    }
  }
  return root;
}

module.exports = getSafeBodyFromHTML;
