# rename  names of all audio files (they are wavs)
# example file name format current: 00x_00y.wave
# example file format final: x_y.wav

import os
import shutil

# path to the audio files
path = "."

# get all file names
files = os.listdir(path)

# iterate over all files
for file in files:
    print("File name: ", file)
    # if file is a wav file
    if file.endswith(".wav"):
        # get the parts of the file name
        file_name_parts = file.split("_")
        # get the new file name
        a = file_name_parts[0][-1]
        if file_name_parts[0] != "001":
            continue
        a = int(a)
        a += 2
        a = str(a)
        b = file_name_parts[1].split(".")[0][-1]
        print(a, b)
        new_file_name = a + "_" + b + ".wav"
        # move the file
        shutil.move(os.path.join(path, file), os.path.join(path, new_file_name))

# print("done renaming files")
