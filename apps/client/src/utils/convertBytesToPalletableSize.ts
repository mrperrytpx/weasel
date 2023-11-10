const SI_KILOBYTE = 1000;

export const convertBytesToPalletableSize = (bytes: number): string => {
    const kilobytes = Math.round((bytes / SI_KILOBYTE) * 100) / 100;

    if (kilobytes < 1000) {
        return kilobytes + "KB";
    }

    const megabytes = Math.round((bytes / (SI_KILOBYTE * SI_KILOBYTE)) * 100) / 100;

    if (megabytes < 1000) {
        return megabytes + "MB";
    }

    const gigabytes = Math.round((bytes / (SI_KILOBYTE * SI_KILOBYTE * 1000)) * 100) / 100;

    return gigabytes + "GB";
};
