# REACT HOOK FORM
## 현재 백엔드 서버 미연결 상태
- 실행X


리액트 상태 관리 중 하나인
훅폼 활용을 위한 테스트 코드


configuration 옵션
1. mode
- mode 와 defaultValues 를 가장 많이 활용
- mode 옵션은 validation 전략을 설정
- mode는 form의 유효성 검사를 어느 동작때 시행할지 설정하는 props
- mode : onSubmit (default) , onChange, onBlur, onTouched , all
- [주의] mode : onChange 다수의 리렌더링 발생
- onBlur 사용자가 submit 버튼을 누르기 전 입력 값이 유효한지 미리 표시 
- onBlur 이벤트가 발생할때마다 validation이 실행

2. defaultValues
- form 에 기본 값 제공
- 기본값을 미제공시 input의 초기값은 undefined

3. register
- 컨트롤 할 폼객체를 리턴받음
- register 를 통해 input태그 핸들링
- required, min, max, minLength, maxLength, pattern, validate, disabled, onChange, value ...
- value 초기 입력값

4. formState
[errors]
- 에러에 대한 정보는 formState 객체의 errors 에 들어있다.
- 에러 미존재시 해당 객체 빈 객체
[submitCount]
- submit한 횟수를 알수있음
[isDirty]
- 사용자가 defaultValues 를 수정한 경우 true
[dirtyFields]
- 기본 값에 수정된 필드값이 담긴 객체
- dirtyFields 를 사용하기 위해선 defaultValues세팅 필수
[touchedFields]
- 사용자에 의해 수정된 필드가 담긴 객체
[isValid]
- 에러 확인

5. watch
- 값을 추적 1 method
- 입력값 추적 -> 반환 -> 해당 값에 따라서 리렌더링
- 폼에 입력된 값을 구독하여 실시간으로 체크

6. getValues
- 값을 추적 2 method
- 반환 -> No 추적 -> No 리랜더링


7. Reset
- 해당 폼으로 create 기능 뿐만 아니라 edit 기능까지 커버
- 수정 페이지


서버 데이터를 위해 react-query 라는 라이브러리를 사용 가능
 react-query 에 비동기 플로우를 맡기고 있기 때문에, reset 에 관한 로직을 useQuery 의 onSuccess 에 넣음
이렇게 코드를 작성한 경우에 useEffect 를 줄일수 있고, 보다 확실한 타이밍에 reset 을 해줌으로써 안정적인 플로우를 구현할 수 있음.
