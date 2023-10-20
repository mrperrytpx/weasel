const KILOBYTE = 1024;

export const roundBytesToKilobytes = (bytes: number) => {
    return Math.round((bytes / KILOBYTE) * 10) / 10;
};
