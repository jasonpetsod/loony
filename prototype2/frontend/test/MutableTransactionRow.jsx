import { assert } from 'chai';
import { mount } from 'enzyme';
import 'jsdom-global/register';  // global.document
import React from 'react';

import MutableTransactionRow from '../src/MutableTransactionRow';

describe('<MutableTransactionRow />', function () {
  it('renders with initialTransactionData');
  it('renders without initialTransactionData');

  it('handles submission', function () {
    let receivedData = null;
    const handler = (data) => {
      receivedData = data;
    };

    const options = {
      attachTo: global.document.createElement('tbody'),
    };
    const wrapper = mount(
      <MutableTransactionRow
        submitHandler={handler}
        submitButtonLabel="Submit"
      />,
      options);

    // Edit fields.
    const setField = (name, value) => {
      const field = wrapper.find({ name });
      const event = {
        target: {
          name,
          value,
        },
      };
      field.simulate('change', event);
    };

    const fields = {
      date: '2017-01-01',
      account: 'Cash',
      payee: 'Mu Ramen',
      category: 'Restaurants',
      memo: 'yay noodles',
      outflow: '23.00',
      inflow: '19.89',
    };
    Object.keys(fields).forEach((name) => { setField(name, fields[name]); });

    // Click submit.
    wrapper.find('input[type="submit"]').simulate('click');

    // Make sure handler() is called with the right data.
    const expectedData = {
      id: '',
      dateMs: 1483246800000,  // TODO: Fix timezones here.
      account: 'Cash',
      payee: 'Mu Ramen',
      category: 'Restaurants',
      memo: 'yay noodles',
      outflow: 23,
      inflow: 19.89,
    };
    assert.deepEqual(receivedData, expectedData);
  });
});
