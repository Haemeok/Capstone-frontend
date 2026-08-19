import { fireEvent, render, screen } from "@testing-library/react";

import { triggerHaptic } from "@/shared/lib/bridge";

import { CookingRecordCustomBackgroundSection } from "../_components/CookingRecordCustomBackgroundSection";
import { CookingRecordViewSettingsDrawer } from "../_components/CookingRecordViewSettingsDrawer";

jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

const copy = {
  customTitle: "내 배경",
  customOptionsLabel: "내 배경 선택",
  addCustom: "사진 추가",
  customLimit: "내 배경 {count}/20",
  addingCustom: "배경을 추가하는 중입니다.",
  processingCustom: "사진을 처리하는 중입니다.",
  retryCustom: "등록 다시 시도",
  deleteCustom: "이 배경 삭제",
  customErrors: {
    EMPTY_FILE: "빈 파일은 추가할 수 없습니다.",
    UNSUPPORTED_TYPE: "JPG, PNG, WEBP 파일만 추가할 수 있습니다.",
    FILE_TOO_LARGE: "10MB 이하 사진을 선택해 주세요.",
    RESELECT_FILE: "사진을 다시 선택해 주세요.",
    LIMIT_REACHED: "내 배경은 20개까지 추가할 수 있습니다.",
    PROCESSING_TIMEOUT: "사진 처리가 늦어지고 있습니다.",
    UPLOAD_FAILED: "배경을 추가하지 못했습니다.",
  },
  optionLabel: "배경 {index}",
};

const drawerCopy = {
  ...copy,
  title: "보기 설정",
  closeLabel: "보기 설정 닫기",
  description: "이름 표시와 배경을 바꿀 수 있어요.",
  showRecordNamesLabel: "요리 이름 표시",
  showRecordNamesDescription: "사진에 요리 이름을 표시해요.",
  intro: "배경은 모든 달의 요리 기록에 함께 적용돼요.",
  previewLabel: "선택한 배경 미리보기",
  optionsTitle: "준비된 배경",
  optionsLabel: "준비된 배경 선택",
  loading: "배경을 불러오는 중입니다.",
  error: "배경 목록을 불러오지 못했습니다.",
  retry: "다시 시도",
  apply: "이 배경 적용",
  applying: "적용하는 중",
};

it("사진 한 장을 선택하면 Light 햅틱과 함께 커스텀 배경 등록을 요청합니다", () => {
  const onAddCustomBackground = jest.fn();
  render(
    <CookingRecordCustomBackgroundSection
      backgrounds={[]}
      copy={copy}
      isPending={false}
      onAddCustomBackground={onAddCustomBackground}
      onSelectBackground={jest.fn()}
    />
  );
  const file = new File(["image"], "kitchen.webp", { type: "image/webp" });

  fireEvent.change(screen.getByLabelText("사진 추가"), {
    target: { files: [file] },
  });

  expect(triggerHaptic).toHaveBeenCalledWith("Light");
  expect(onAddCustomBackground).toHaveBeenCalledWith(file);
});

it("등록 중에는 파일 입력을 잠그고 상태를 알립니다", () => {
  render(
    <CookingRecordCustomBackgroundSection
      backgrounds={[]}
      copy={copy}
      isPending
      onAddCustomBackground={jest.fn()}
      onSelectBackground={jest.fn()}
    />
  );

  expect(screen.getByLabelText("사진 추가")).toBeDisabled();
  expect(screen.getByRole("status")).toHaveTextContent(
    "배경을 추가하는 중입니다."
  );
});

it("등록된 CUSTOM을 선택 가능한 내 배경으로 보여줍니다", () => {
  render(
    <CookingRecordCustomBackgroundSection
      backgrounds={[
        {
          backgroundKey: "C_custom1",
          backgroundType: "CUSTOM",
          imageUrl: "https://cdn.example.com/custom.webp",
          selected: false,
        },
      ]}
      copy={copy}
      isPending={false}
      selectedBackgroundKey="C_custom1"
      onAddCustomBackground={jest.fn()}
      onSelectBackground={jest.fn()}
    />
  );

  expect(screen.getByRole("button", { name: "배경 1" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  expect(screen.getByText("내 배경 1/20")).toBeInTheDocument();
});

it("등록 실패 원인과 다시 시도 동작을 같은 영역에서 안내합니다", () => {
  const onRetryRegistration = jest.fn();
  render(
    <CookingRecordCustomBackgroundSection
      backgrounds={[]}
      copy={copy}
      errorMessage="사진 처리가 늦어지고 있습니다."
      retryLabel="등록 다시 시도"
      isPending={false}
      onAddCustomBackground={jest.fn()}
      onRetryRegistration={onRetryRegistration}
      onSelectBackground={jest.fn()}
    />
  );

  expect(screen.getByRole("alert")).toHaveTextContent(
    "사진 처리가 늦어지고 있습니다."
  );
  fireEvent.click(screen.getByRole("button", { name: "등록 다시 시도" }));
  expect(onRetryRegistration).toHaveBeenCalledTimes(1);
});

it("드로어는 CUSTOM과 PRESET을 나누고 사진 등록만으로 적용하지 않습니다", () => {
  const onAddCustomBackground = jest.fn();
  const onApply = jest.fn();
  render(
    <CookingRecordViewSettingsDrawer
      isOpen
      isRecordNameVisible
      backgrounds={[
        {
          backgroundKey: "C_custom1",
          backgroundType: "CUSTOM",
          imageUrl: "https://cdn.example.com/custom.webp",
          selected: false,
        },
        {
          backgroundKey: "DEFAULT",
          backgroundType: "PRESET",
          imageUrl: null,
          selected: true,
        },
      ]}
      previewBackground={{
        backgroundKey: "DEFAULT",
        backgroundType: "PRESET",
        imageUrl: null,
      }}
      selectedBackgroundKey="DEFAULT"
      previewRecords={[]}
      copy={drawerCopy}
      isListPending={false}
      isListError={false}
      isAddingCustom={false}
      isCustomBackgroundProcessing={false}
      isApplying={false}
      onOpenChange={jest.fn()}
      onRecordNameVisibilityChange={jest.fn()}
      onSelectBackground={jest.fn()}
      onAddCustomBackground={onAddCustomBackground}
      onRetryCustomBackground={jest.fn()}
      onRequestDeleteCustomBackground={jest.fn()}
      onRetry={jest.fn()}
      onApply={onApply}
    />
  );
  const file = new File(["image"], "kitchen.jpg", { type: "image/jpeg" });

  fireEvent.change(screen.getByLabelText("사진 추가"), {
    target: { files: [file] },
  });

  expect(screen.getByText("내 배경")).toBeInTheDocument();
  expect(screen.getByText("준비된 배경")).toBeInTheDocument();
  expect(onAddCustomBackground).toHaveBeenCalledWith(file);
  expect(onApply).not.toHaveBeenCalled();
});

it("선택한 CUSTOM은 삭제 요청과 등록 지연 재시도를 제공합니다", () => {
  const onRetryCustomBackground = jest.fn();
  const onRequestDeleteCustomBackground = jest.fn();
  render(
    <CookingRecordViewSettingsDrawer
      isOpen
      isRecordNameVisible
      backgrounds={[
        {
          backgroundKey: "C_custom1",
          backgroundType: "CUSTOM",
          imageUrl: "https://cdn.example.com/custom.webp",
          selected: false,
        },
      ]}
      previewBackground={{
        backgroundKey: "C_custom1",
        backgroundType: "CUSTOM",
        imageUrl: "https://cdn.example.com/custom.webp",
      }}
      selectedBackgroundKey="C_custom1"
      previewRecords={[]}
      copy={drawerCopy}
      isListPending={false}
      isListError={false}
      isAddingCustom={false}
      isCustomBackgroundProcessing={false}
      customBackgroundErrorKind="PROCESSING_TIMEOUT"
      isApplying={false}
      onOpenChange={jest.fn()}
      onRecordNameVisibilityChange={jest.fn()}
      onSelectBackground={jest.fn()}
      onAddCustomBackground={jest.fn()}
      onRetryCustomBackground={onRetryCustomBackground}
      onRequestDeleteCustomBackground={onRequestDeleteCustomBackground}
      onRetry={jest.fn()}
      onApply={jest.fn()}
    />
  );

  expect(screen.getByRole("alert")).toHaveTextContent(
    "사진 처리가 늦어지고 있습니다."
  );
  fireEvent.click(screen.getByRole("button", { name: "등록 다시 시도" }));
  fireEvent.click(screen.getByRole("button", { name: "이 배경 삭제" }));
  expect(onRetryCustomBackground).toHaveBeenCalledTimes(1);
  expect(onRequestDeleteCustomBackground).toHaveBeenCalledTimes(1);
});
