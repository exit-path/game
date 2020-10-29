const decoder = new TextDecoder();

export class Reader {
  offset = 0;

  constructor(readonly data: DataView) {
  }

  readByte() {
    const value = this.data.getUint8(this.offset);
    this.offset++;
    return value;
  }

  readInt32() {
    const value = this.data.getInt32(this.offset, true);
    this.offset += 4;
    return value;
  }

  readFloat() {
    const value = this.data.getFloat32(this.offset, true);
    this.offset += 4;
    return value;
  }

  readByteLengthString() {
    const length = this.readByte();
    const buf = this.data.buffer.slice(this.offset, this.offset + length);
    this.offset += length;
    return decoder.decode(buf);
  }
}
