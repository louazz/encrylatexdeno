import { Router } from "https://deno.land/x/oak/mod.ts";
import { signin, signup } from "../controllers/users.ts";
import { create, deleteById, findById, getByUserId, updateById } from "../controllers/documents.ts";
import { Docx, compileFile, fileUpload } from "../controllers/compile.ts";
import { isAuthorized } from "../middleware/isAuthorized.ts";

const router = new Router();

router.post("/api/signup", signup)
router.post("/api/signin", signin)

router.post("/api/document",isAuthorized, create);
router.get("/api/document/user/:userId",isAuthorized, getByUserId);
router.get("/api/document/:docId", isAuthorized,findById);
router.patch("/api/document/:docId",isAuthorized,updateById);
router.delete("/api/document/:docId",isAuthorized, deleteById);

router.post("/api/document/upload/:docId", fileUpload);
router.get("/api/document/compile/:docId",compileFile)
router.get("/api/document/docx/:docId", Docx)

export default router;