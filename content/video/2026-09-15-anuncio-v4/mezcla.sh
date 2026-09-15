#!/bin/bash
# mezcla.sh <musica.mp3> <volumen> <salida.m4a>  — cama bajo la locucion con sidechain y fundido en la tarjeta final
FF=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
DUR=$(grep -o "const DUR=[0-9.]*" escena.html | cut -d= -f2); FO=$(python3 -c "print($DUR-1.6)")
$FF -y -i locucion.m4a -i "$1" -filter_complex "[1:a]aformat=sample_rates=44100:channel_layouts=stereo,atrim=0:$DUR,asetpts=PTS-STARTPTS,afade=t=in:d=0.4,afade=t=out:st=$FO:d=1.6,volume=$2[m];[0:a]aformat=sample_rates=44100:channel_layouts=stereo,asplit=2[v][vsc];[m][vsc]sidechaincompress=threshold=0.03:ratio=3:attack=40:release=700:makeup=1[md];[v][md]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=9,aformat=sample_rates=44100[out]" -map "[out]" -ar 44100 -c:a aac -b:a 192k "$3" 2>/dev/null
