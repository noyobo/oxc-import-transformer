import { ActionSheet, Button as Btn } from '@ray-js/smart-ui';
import { Picker } from '@ray-js/ui-smart';

export default () => {
  return (
    <Btn
      title="hello"
      onClick={() => {
        console.log('hello');
      }}
    >
      <ActionSheet>hello</ActionSheet>
      <Picker>hello</Picker>
    </Btn>
  );
};
