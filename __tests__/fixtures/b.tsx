import { ActionSheet, Button as Btn } from '@ray-js/smart-ui';

export default () => {
  return (
    <Btn
      title="hello"
      onClick={() => {
        console.log('hello');
      }}
    >
      <ActionSheet>hello</ActionSheet>
    </Btn>
  );
}