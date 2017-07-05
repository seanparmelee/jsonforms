import test from 'ava';
// inject window, document etc.
declare var global;
import 'jsdom-global/register';
import * as installCE from 'document-register-element/pony';
installCE(global);
import {JsonSchema} from '../src/models/jsonSchema';
import {ControlElement} from '../src/models/uischema';
import {JsonFormsElement} from '../src/json-forms';
import '../src/renderers/renderers';
import '../src/services/services';
import {generateDefaultUISchema} from '../src/generators/ui-schema-gen';
import {generateJsonSchema} from '../src/generators/schema-gen';

test('Connect JSON Forms element with data only', t => {
    const jsonForms = new JsonFormsElement();
    jsonForms.data = {name: 'foo'};
    jsonForms.connectedCallback();
    t.is(jsonForms.children.length, 1);
    t.is(jsonForms.children.item(0).tagName, 'JSONFORMS-VERTICALLAYOUT');
    const jsonSchema = generateJsonSchema({name: 'foo'});
    t.deepEqual(jsonForms.dataSchema, jsonSchema);
    t.deepEqual(jsonForms.uiSchema, generateDefaultUISchema(jsonSchema));
});
test('Connect JSON Forms element with data and data schema set', t => {
    const jsonForms = new JsonFormsElement();
    jsonForms.data = {name: 'foo'};
    jsonForms.dataSchema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
    jsonForms.connectedCallback();
    t.is(jsonForms.children.length, 0);
});
test.cb('Connect JSON Forms element with data and data schema set', t => {
    t.plan(4);
    const jsonForms = new JsonFormsElement();
    jsonForms.data = {name: 'foo'};
    const dataSchema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
    jsonForms.dataSchema = dataSchema;
    setTimeout(() => {
      jsonForms.connectedCallback();
      t.is(jsonForms.children.length, 1);
      t.is(jsonForms.children.item(0).tagName, 'JSONFORMS-VERTICALLAYOUT');
      t.deepEqual(jsonForms.dataSchema.properties, dataSchema.properties);
      t.deepEqual(jsonForms.uiSchema, generateDefaultUISchema(dataSchema));
      t.end();
    }, 100);
});
test('Connect JSON Forms element with data and UI schema set', t => {
    const jsonForms = new JsonFormsElement();
    jsonForms.data = {name: 'foo'};
    const uiSchema = {type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement;
    jsonForms.uiSchema = uiSchema;
    jsonForms.connectedCallback();
    t.is(jsonForms.children.length, 1);
    t.is(jsonForms.children.item(0).tagName, 'JSONFORMS-TEXT');
    t.deepEqual(jsonForms.dataSchema, generateJsonSchema({name: 'foo'}));
    t.is(jsonForms.uiSchema, uiSchema);
});
test.cb('Connect JSON Forms element with data, data and UI schema set', t => {
    t.plan(4);
    const jsonForms = new JsonFormsElement();
    jsonForms.data = {name: 'foo'};
    const dataSchema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
    jsonForms.dataSchema = dataSchema;
    const uiSchema = {type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement;
    jsonForms.uiSchema = uiSchema;
    setTimeout(() => {
      jsonForms.connectedCallback();
      t.is(jsonForms.children.length, 1);
      t.is(jsonForms.children.item(0).tagName, 'JSONFORMS-TEXT');
      t.deepEqual(jsonForms.dataSchema.properties, dataSchema.properties);
      t.is(jsonForms.uiSchema, uiSchema);
      t.end();
    }, 100);
});
test.cb('Connect JSON Forms element with data and UI schema set', t => {
    t.plan(3);
    const jsonForms = new JsonFormsElement();
    const dataSchema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
    jsonForms.dataSchema = dataSchema;
    const uiSchema = {type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement;
    jsonForms.uiSchema = uiSchema;
    setTimeout(() => {
      jsonForms.connectedCallback();
      t.is(jsonForms.children.length, 0);
      t.deepEqual(jsonForms.dataSchema, dataSchema);
      t.is(jsonForms.uiSchema, uiSchema);
      t.end();
    }, 100);
});
test('Connect JSON Forms element and cause data change', t => {
    const jsonForms = new JsonFormsElement();
    jsonForms.data = {name: 'foo'};
    t.is(jsonForms['dataService']['dataChangeListeners'].length, 0);
    jsonForms.connectedCallback();
    // as the renderers are not connected no change listeners are attached
    t.is(jsonForms['dataService']['dataChangeListeners'].length, 2);
    t.is(jsonForms.children.length, 1);
    {
      const verticalLayout = jsonForms.children.item(0);
      t.is(verticalLayout.tagName, 'JSONFORMS-VERTICALLAYOUT');
      verticalLayout['connectedCallback']();
      t.is(verticalLayout.children[0].children.length, 1);
    }
    jsonForms.data = {lastname: 'foo', fristname: 'bar'};
    // as the renderers are not connected no change listeners are attached
    t.is(jsonForms['dataService']['dataChangeListeners'].length, 2);
    t.is(jsonForms.children.length, 1);
    {
      const verticalLayout = jsonForms.children.item(0);
      t.is(verticalLayout.tagName, 'JSONFORMS-VERTICALLAYOUT');
      verticalLayout['connectedCallback']();
      t.is(verticalLayout.children[0].children.length, 2);
    }
    jsonForms.disconnectedCallback();
    t.is(jsonForms['dataService']['dataChangeListeners'].length, 0);
});