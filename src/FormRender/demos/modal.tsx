import { Button } from 'antd';
import { FormRender } from 'guos-components';
import { FormDialog } from 'guos-components/FormRender/dependencies/formilyAntd';
import { Form as IFrom } from 'guos-components/FormRender/dependencies/formilyCore';
import React from 'react';

import schema from './schema/basic.json';

const App = () => {
  let baseForm: IFrom;
  return (
    <FormDialog.Portal>
      <Button
        onClick={() => {
          const dialog = FormDialog('弹窗表单', () => {
            return (
              <FormRender
                schema={schema}
                getForm={(form) => (baseForm = form)}
              />
            );
          });

          dialog
            .forOpen((payload, next) => {
              console.log(payload, 'forOpen');
              next(payload);
            })
            .forConfirm((payload) => {
              baseForm
                .submit()
                .then((values) => {
                  payload.setSubmitting(true);
                  console.log(values, '====values');
                })
                .catch(() => {
                  payload.setSubmitting(false);
                });
            })
            .forCancel((payload, next) => {
              console.log(payload, 'forCancel');
              next(payload);
            })
            .open()
            .then(console.log);
        }}
      >
        点我打开表单
      </Button>
    </FormDialog.Portal>
  );
};

export default App;
