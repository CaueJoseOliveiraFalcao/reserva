const crypto = require(`crypto`)
const SECRET_KEY=`SRFDGVWW34R42EWT24E2FTGEWRF24`;
const IV_LENGTH = 16;



 function encryptId(id) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', crypto.scryptSync(SECRET_KEY, 'sal', 32), iv);
  let encrypted = cipher.update(id.toString(), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

 function decryptId(encrypted) {
  const [ivHex, encryptedData] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', crypto.scryptSync(SECRET_KEY, 'sal', 32), iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = {
  encryptId,
  decryptId,
};