const KILOBYTE = 1024;

export const roundBytesToMegabytes = (bytes: number) => {
    return Math.round((bytes / KILOBYTE / KILOBYTE) * 10) / 10;
};
