# 모달 폼 구현

## 폼 구성

- title
- description
- Form
  - name
  - email
  - FE 연차 (select)
  - GitHub 링크 (선택)
- Submit 버튼
- Cancel 버튼

## 구성

- html dialog 이용 (자체 접근성 이상의 aria, 접근성 요소 추가 X)
- aria 요소 (필요 시 추가) - html dialog는 자체 접근성을 지니기 때문에 필요시에만 추가
- 포커스 관리 (html 기본 요소들의 접근성을 우선하고 필요 시 작성)
- 선언적 폼 사용? -> 제출 시 폼데이터 반환 취소/닫기 시 `null` 반환
  - overlay-kit 사용

## Stacks

### 기본

- React
- TypeScript

### 추가

- Tailwind CSS
- overlay-kit
