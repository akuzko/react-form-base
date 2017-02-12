import React from 'react';
import marked from 'marked';

const content = `
This demo application shows the basic usage examples of [react-form-base](https://github.com/akuzko/react-form-base).
It renders a number of forms, each of which demonstrates specific use case scenario
with a short description.

**NOTE:** Please keep in mind that source code, rendered on the left side, is
not 100% accurate, since it does not contain all of the markup (including
\`className\`s), which was omitted for brevity.
`;

export default function Intro() {
  return (
    <div className="pb-20 mb-20 border-bottom">
      <h1>React Form Base Demo</h1>
      <div className="mb-20" dangerouslySetInnerHTML={{ __html: marked(content) }} />
    </div>
  );
}