import React from 'react';
import Form, { TextField, Select } from '../form';

class ItemForm extends Form {
  render() {
    return (
      <div>
        <Select {...this.input('amount')} options={[10, 50, 100]} includeBlank />
        <TextField {...this.input('comment')} placeholder="Comment" />
      </div>
    );
  }
}

export default class Form5 extends Form {
  static title = 'Nested Forms';
  static description = `In this example main form`;
  static source = `
    // read about those setup components at the beginning of examples
    import Form, { TextField, Select } from 'form';

    class ItemForm extends Form {
      render() {
        return (
          <div>
            <Select {...this.input('amount')} options={[10, 50, 100]} includeBlank />
            <TextField {...this.input('comment')} placeholder="Comment" />
          </div>
        );
      }
    }

    class Form5 extends Form {
      render() {
        return (
          <div>
            <TextField {...this.$('firstName')} placeholder="Full Name" />

            {this.mapExtraIn('items', i =>
              <div key={i}>
                <TextField {...this.input(\`items.\${i}.name\`)} placeholder={ \`Item \${i + 1}\` } />
                {this.get(\`items.\${i}\`) &&
                  <div>
                    <ItemForm attrs={this.get(\`items.\${i}\`)} onChange={(form) => this.merge(\`items.\${i}\`, form)} />
                    <button onClick={() => this.spliceIn('items', i)}>X</button>
                  </div>
                }
              </div>
            )}
          </div>
        );
      }
    }
  `;

  render() {
    return (
      <div>
        {this.renderExample()}

        <TextField {...this.$('fullName')} placeholder="Full Name" />

        {this.mapExtraIn('items', i =>
          <div key={i}>
            <TextField {...this.input(`items.${i}.name`)} placeholder={ `Item ${i + 1}` } />
            {this.get(`items.${i}`) &&
              <div>
                <ItemForm attrs={this.get(`items.${i}`)} onChange={(form) => this.merge(`items.${i}`, form)} />
                <button onClick={() => this.spliceIn('items', i)}>X</button>
              </div>
            }
          </div>
        )}
      </div>
    );
  }
}
