/** @type {import('prettier').Config} */
module.exports = {
  plugins: ['prettier-plugin-tailwindcss'],
  printWidth: 80, // 한 줄 최대 길이
  tabWidth: 2, // 들여쓰기 간격
  useTabs: false, // 탭 대신 스페이스 사용
  semi: true, // 세미콜론 사용
  singleQuote: true, // 작은따옴표 사용
  trailingComma: 'es5', // 후행 쉼표 사용
  bracketSpacing: true, // 객체 리터럴의 괄호 사이에 공백 추가
  bracketSameLine: false, // JSX 요소의 마지막 `>` 를 다음 줄로 내림
  arrowParens: 'always', // 화살표 함수 매개변수 괄호 항상 사용
  endOfLine: 'lf', // 줄 끝 문자로 LF 사용
  htmlWhitespaceSensitivity: 'css', // HTML 공백 처리 방식
  jsxSingleQuote: false, // JSX에서 큰따옴표 사용
};
