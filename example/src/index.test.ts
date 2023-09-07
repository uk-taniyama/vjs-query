import '.';
import q from 'vjs-query';

describe('example', () => {
  it('join', () => {
    document.write('<ul><li>1st.<li>2nd.</ul>');

    expect(q().join()).toEqual('1st.2nd.');
    expect(q('li').join()).toEqual('1st.,2nd.');
  });
});
