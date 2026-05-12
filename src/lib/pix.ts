export function generatePixPayload(key: string, name: string, city: string, amount: number, txid: string = '***'): string {
  // PIX payload format implementation
  const formatLength = (val: string) => val.length.toString().padStart(2, '0');

  const payloadFormatIndicator = "000201";
  
  const merchantAccountInformation = `0014BR.GOV.BCB.PIX01${formatLength(key)}${key}`;
  const merchantAccountFormatted = `26${formatLength(merchantAccountInformation)}${merchantAccountInformation}`;
  
  const merchantCategoryCode = "52040000";
  const transactionCurrency = "5303986";
  const transactionAmount = amount ? `54${formatLength(amount.toFixed(2))}${amount.toFixed(2)}` : "";
  const countryCode = "5802BR";
  
  const formattedName = name.substring(0, 25).toUpperCase();
  const merchantName = `59${formatLength(formattedName)}${formattedName}`;
  
  const formattedCity = city.substring(0, 15).toUpperCase();
  const merchantCity = `60${formatLength(formattedCity)}${formattedCity}`;
  
  const additionalDataFieldTemplate = `05${formatLength(txid)}${txid}`;
  const additionalDataFormatted = `62${formatLength(additionalDataFieldTemplate)}${additionalDataFieldTemplate}`;

  const payload = `${payloadFormatIndicator}${merchantAccountFormatted}${merchantCategoryCode}${transactionCurrency}${transactionAmount}${countryCode}${merchantName}${merchantCity}${additionalDataFormatted}6304`;

  // Calculate CRC16
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  const crcHex = (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  
  return `${payload}${crcHex}`;
}
