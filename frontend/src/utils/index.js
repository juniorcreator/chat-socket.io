import { nextTick } from 'vue';

const scrollToBottom = async (parentElement) => {
  console.log(parentElement.value, ' parentElement');
  await nextTick(() => {
    const container = parentElement.value?.refContainer;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  });
};
