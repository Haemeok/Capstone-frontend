import { PageResponse } from "@/shared/api/types";

import { Comment } from "@/entities/comment/model/types";

export type CommentsApiResponse = PageResponse<Comment>;
