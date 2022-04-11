import { Router } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { getProfile } from './handlers';

const profileRouter = Router({ mergeParams: true });

profileRouter.get('/', asyncHandler(getProfile));

export default profileRouter;
