import type { Locale } from "./types";

export type RecordPhotoCopy = {
  style: string;
  dishMode: string;
  stickerMode: string;
  photo: string;
  add: string;
  edit: string;
  shape: string;
  plates: string;
  sticker: string;
  none: string;
  empty: string;
  loading: string;
  error: string;
  retry: string;
  invalidFile: string;
  stickerProcessing: string;
  stickerFailed: string;
  stickerUnavailable: string;
  stickerAfterSave: string;
  uploadToStyle: string;
  editor: {
    title: string;
    hint: string;
    cancel: string;
    done: string;
    replace: string;
  };
  categories: {
    all: string;
    plain: string;
    pattern: string;
    botanical: string;
    material: string;
    other: string;
  };
  masks: Record<string, string>;
};
export const recordPhotoMessages: Record<Locale, RecordPhotoCopy> = {
  ko: {
    stickerAfterSave: "저장하면 사진의 배경을 제거해 스티커로 만들어요.",
    uploadToStyle: "직접 찍은 사진을 추가하면 접시와 모양을 고를 수 있어요.",
    style: "사진 스타일",
    dishMode: "접시에 담기",
    stickerMode: "스티커로 만들기",
    photo: "요리 사진",
    add: "사진 추가",
    edit: "사진 수정하기",
    shape: "사진 모양",
    plates: "접시",
    sticker: "스티커",
    none: "접시 없음",
    empty: "사진을 추가해 주세요",
    loading: "접시를 불러오는 중이에요",
    error: "접시를 불러오지 못했어요",
    retry: "다시 시도",
    invalidFile: "10MB 이하의 JPG, PNG, WebP 사진을 선택해 주세요.",
    stickerProcessing: "스티커 만드는 중이에요",
    stickerFailed:
      "스티커를 만들지 못했어요. 다시 시도하거나 다른 사진 모양을 선택해 주세요.",
    stickerUnavailable:
      "스티커 미리보기를 사용할 수 없어요. 다른 사진 모양을 선택해 주세요.",
    editor: {
      title: "사진 수정",
      hint: "손가락으로 옮기거나 두 손가락으로 확대해 주세요",
      cancel: "취소",
      done: "완료",
      replace: "사진 변경",
    },
    categories: {
      all: "전체",
      plain: "무지",
      pattern: "패턴",
      botanical: "꽃·잎",
      material: "소재",
      other: "기타",
    },
    masks: {
      CIRCLE: "원형",
      ROUNDED_DIAMOND: "둥근 마름모",
      ROUNDED_HEXAGON: "둥근 육각형",
      ROUNDED_OCTAGON: "둥근 팔각형",
      WAVY_CIRCLE_5: "5물결 원형",
      WAVY_CIRCLE_6: "6물결 원형",
      WAVY_CIRCLE_8: "8물결 원형",
      WAVY_CIRCLE_10: "10물결 원형",
    },
  },
  en: {
    stickerAfterSave: "The background will be removed after you save.",
    uploadToStyle: "Add your own photo to choose a plate and shape.",
    style: "Photo style",
    dishMode: "Place on a plate",
    stickerMode: "Make a sticker",
    photo: "Cooking photo",
    add: "Add photo",
    edit: "Edit photo",
    shape: "Photo shape",
    plates: "Plate",
    sticker: "Sticker",
    none: "No plate",
    empty: "Add a photo",
    loading: "Loading plates",
    error: "Unable to load plates",
    retry: "Try again",
    invalidFile: "Choose a JPG, PNG or WebP photo up to 10 MB.",
    stickerProcessing: "Making your sticker",
    stickerFailed:
      "Unable to make a sticker. Try again or choose another photo shape.",
    stickerUnavailable:
      "Sticker preview is unavailable. Choose another photo shape.",
    editor: {
      title: "Edit photo",
      hint: "Drag to move. Pinch with two fingers to zoom.",
      cancel: "Cancel",
      done: "Done",
      replace: "Change photo",
    },
    categories: {
      all: "All",
      plain: "Plain",
      pattern: "Pattern",
      botanical: "Botanical",
      material: "Material",
      other: "Other",
    },
    masks: {
      CIRCLE: "Circle",
      ROUNDED_DIAMOND: "Rounded diamond",
      ROUNDED_HEXAGON: "Rounded hexagon",
      ROUNDED_OCTAGON: "Rounded octagon",
      WAVY_CIRCLE_5: "Five-wave circle",
      WAVY_CIRCLE_6: "Six-wave circle",
      WAVY_CIRCLE_8: "Eight-wave circle",
      WAVY_CIRCLE_10: "Ten-wave circle",
    },
  },
  ja: {
    stickerAfterSave: "保存すると写真の背景を削除してステッカーにします。",
    uploadToStyle: "自分で撮った写真を追加すると、お皿と形を選べます。",
    style: "写真のスタイル",
    dishMode: "お皿に盛り付ける",
    stickerMode: "ステッカーにする",
    photo: "料理の写真",
    add: "写真を追加",
    edit: "写真を編集",
    shape: "写真の形",
    plates: "お皿",
    sticker: "ステッカー",
    none: "お皿なし",
    empty: "写真を追加してください",
    loading: "お皿を読み込み中です",
    error: "お皿を読み込めませんでした",
    retry: "再試行",
    invalidFile: "10MB以下のJPG・PNG・WebP写真を選んでください。",
    stickerProcessing: "ステッカーを作成中です",
    stickerFailed:
      "ステッカーを作成できませんでした。再試行するか、別の写真の形を選んでください。",
    stickerUnavailable:
      "ステッカーのプレビューを利用できません。別の写真の形を選んでください。",
    editor: {
      title: "写真を編集",
      hint: "指で移動、2本の指で拡大できます",
      cancel: "キャンセル",
      done: "完了",
      replace: "写真を変更",
    },
    categories: {
      all: "すべて",
      plain: "無地",
      pattern: "柄",
      botanical: "花・葉",
      material: "素材",
      other: "その他",
    },
    masks: {
      CIRCLE: "円形",
      ROUNDED_DIAMOND: "丸いひし形",
      ROUNDED_HEXAGON: "丸い六角形",
      ROUNDED_OCTAGON: "丸い八角形",
      WAVY_CIRCLE_5: "5つの波の円形",
      WAVY_CIRCLE_6: "6つの波の円形",
      WAVY_CIRCLE_8: "8つの波の円形",
      WAVY_CIRCLE_10: "10の波の円形",
    },
  },
};
