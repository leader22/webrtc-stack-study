import { STUN_ATTRIBUTE_TYPE } from '../attribute-type';
import { calcPaddingByte } from '../utils';

export class SoftwareAttribute {
  static fromBuffer(buffer: Buffer): SoftwareAttribute {
    const name = buffer.toString();
    return new SoftwareAttribute(name);
  }

  constructor(private _name: string) {}

  get name(): string {
    return this._name;
  }

  toBuffer(): Buffer {
    // allocate dynamically for value
    const value = Buffer.from(this.name);

    // 2byte(16bit) for type
    const type = Buffer.alloc(2);
    type.writeUInt16BE(STUN_ATTRIBUTE_TYPE.SOFTWARE, 0);

    // 2byte(16bit) for length
    const length = Buffer.alloc(2);
    length.writeUInt16BE(value.length, 0);

    // Value must be in N * 32 bit w/ padding bit (= 4N byte)
    // pad missing bytes
    const paddingByte = calcPaddingByte(value.length, 4);
    const padding = Buffer.alloc(paddingByte);

    return Buffer.concat([type, length, value, padding]);
  }
}