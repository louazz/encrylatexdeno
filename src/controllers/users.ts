import db from "../database/connectDB.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { UserSchema } from "../schema/user.ts";
import { create } from "https://deno.land/x/djwt@v2.4/mod.ts";
import { key } from "../utils/apiKey.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const client = new SmtpClient();

await client.connectTLS({
  hostname: "smtp.gmail.com",
  port: 465,
  username: "encrygen@gmail.com",
  password: "vniwrrfbdwwxziqr",
});
const Users = db.collection<UserSchema>("users");

export const signup = async (
  { request, response }: { request: any; response: any },
) => {
  const { username, password, email } = await request.body().value;
  const salt = await bcrypt.genSalt(8);
  const hashedPassword = await bcrypt.hash(password, salt);

  const _id = await Users.insertOne({
    username,
    password: hashedPassword,
    email: email,
  });
  const mailOptions = {
    from: '"Encrylatex" <encrygen@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Welcome to encrylatex 👾 '+username, // Subject line
    content:"",
    html: `<p>Dear ${username},<br/>Welcome to encrylatex.live. 🤖<br/>You can now create and edit latex document.<br/> Always remember that you can export your document to PDF or DOCX.<br/><br/>Best regards,<br/> encrylatex Team </p>` // html body
};
try{
// send mail with defined transport object
  await client.send(mailOptions)
  await client.close()
}catch(e){
  console.log(e)
  response.status = 201;
  response.body = { message: "User Created", userId: _id };
  return;
}
  response.status = 201;
  response.body = { message: "User Created", userId: _id };
};

export const signin = async (
  { request, response }: { request: any; response: any },
) => {
  const body = await request.body();
  const { username, password } = await body.value;

  const user = await Users.findOne({ username });
  if (!user) {
    response.status = 404;
    response.body = { message: "User not found" };
  }

  const confirmPassword = await bcrypt.compare(password, user.password);

  if (!confirmPassword) {
    response.status = 404;
    response.body = { message: "Incrrect password" };
  }

  const payload = {
    id: user?._id,
    name: user?.username,
  };

  const jwt = await create({ alg: "HS512", typ: "JWT" }, { payload }, key);
  if (jwt) {
    response.status = 200;
    response.body = {
      userId: user?._id,
      username: user?.username,
      token: jwt,
    };
  } else {
    response.status = 500;
    response.body = {
      message: "internal server error",
    };
  }
  return;
};
