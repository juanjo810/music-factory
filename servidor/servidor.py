##
# @mainpage Soundscape Generator
#
# @section description_main Descripción
# Servidor encargado de la generación automática de paisajes sonoros
#

##
# @file soundscapeServer.py
#
# @brief Codigo del servidor generador
#
# @section description_doxygen_example Descripción
# Este fichero contiene la funcionalidad necesaria para:
# - Recibir las peticiones HTTP de tipo POST del cliente con la imagen del usuario.
# - Ejecutar la red neuronal de reconocimiento de imágenes
# - Generación del paisaje sonoro a partir de los bobjetos reconocidos
# @section libraries_main Libraries/Modules
# - Scaper library
#   - Generación del paisaje sonoro
# - http.server module
#   - Servidor HTTP simple.
#
# @section author_doxygen_example Autor
# - Created by Juan José Navarro on 04/07/2022

from http.server import SimpleHTTPRequestHandler, HTTPServer
import json
import os
import json
import random
import subprocess
import numpy
import scaper
import requests
import logging
from pathlib import Path

hostName = "65.108.220.52"
serverPort = 80

##
# Clase que define las peticiones HTTP soportadas por el servidor
#
class MyServer(SimpleHTTPRequestHandler):
  ##
  # Definición de los header predeterminados. Utilizados para evitar que los CORS de los navegadores den error en las peticiones.
  #
  def end_headers (self):
    self.send_header('Access-Control-Allow-Origin', '*')
    self.send_header('Access-Control-Allow-Headers', '*')
    SimpleHTTPRequestHandler.end_headers(self)

  ##
  # Definición de la petición POST del servidor
  # En ella se realiza la lectura de la imagen y su descarga en disco. Después se ejecuta la red neuronal de reconocimiento de objetos en la imagen.
  # A continuación se determinan los sonidos de background y foreground generando el paisaje sonoro de salida para finalmente, enviar la respuesta al cliente.
  #
  def do_POST(self):
    # Lectura de datos de la imagen del cliente y almacenamiento en disco
    content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
    post_data = self.rfile.read(content_length) # <--- Gets the data itself
    url = post_data.decode('ascii')
    
    logging.info("POST request,\nPath: %s\nHeaders:\n%s\n\nBody:\n%s\n",
            str(self.path), str(self.headers), post_data.decode('utf-8'))
    image = requests.get(url)
    open("./image.jpg", "wb").write(image.content)

    # Ejecución de la red neuronal y lectura de los resultados obtenidos.
    subprocess.run(["./darknet","detector", "test", "./cfg/coco.data", "./cfg/yolov4.cfg", "./yolov4.weights", "-dont_show", "-out", "./result.json", "./image.jpg"])
    f = open('./result.json')
    data = json.load(f)
    myset=set()
    objects=data[0]['objects']
    for i in objects:
        myset.add(i['name'])
    print(myset)
    f.close()
    
    # Comprobación de detección de algún objeto en la imagen
    if len(myset) != 0:

      # Definción del ambiente de background del paisaje sonoro
      outfolder = './Sonidos/soundscape'
      print(myset)
      eventsList = ["bicycle", "car", "motorbike", "bus", "train", "truck", "boat", "bird", 
                    "cat", "dog", "horse", "sheep", "cow", "elephant", "bear", "skateboard",
                    "tennis racket", "chair", "cell phone", "microwave", "toaster", "sink", "hair drier"]
      cutleryList = ["knife", "fork", "spoon"]
      baseballList = ["baseball glove", "baseball bat"]
      eventSet = set()
      backs = []
      backs.append(["bed", "chair", "laptop", "teddy bear", "book", "person"])
      backs.append(["car", "motorbike", "bus", "traffic light", "fire hydrant", "stop sign", "person"])
      backs.append(["train", "suitcase", "person", "handbag", "backpack", "bench"])
      backs.append(["person", "giraffe", "bird", "zebra", "bear", "elephant"])
      backs.append(["person", "wine glass", "cup", "fork", "knife", "spoon", "bowl", "banana", "apple", "sandwich",
                  "orange", "broccoli", "carrot", "chair", "microwave", "oven", "toaster", "sink", "refrigerator"])

      backs.append(["person", "baseball glove", "baseball bat", "tennis racket", "sport ball"])
      backgrounds = ["bedroom","street", "train station", "zoo", "kitchen", "stadium"]
      myArray = list(myset)
      res = []
      porcentage = []

      for i in range(numpy.size(backs)):
          res.append(numpy.intersect1d(backs[i], myArray))

      for i in range(numpy.size(res)):
          porcentage.append(numpy.size(res[i])/numpy.size(backs[i]))

      background = backgrounds[numpy.argmax(porcentage)]
      print(background)


      # Configuración del objeto Scaper proporcionado por la librería
      fg_folder = './Sonidos/foreground'
      bg_folder = './Sonidos/background'
      event_time_dist = 'uniform'
      event_time_min = 0
      event_time_max = 40

      source_time_dist = 'const'
      source_time = 0.0

      event_duration_dist = 'uniform'
      event_duration_min = 1.0
      event_duration_max = 8.0

      snr_dist = 'uniform'
      snr_min = 6
      snr_max = 30

      pitch_dist = 'uniform'
      pitch_min = -3.0
      pitch_max = 3.0

      time_stretch_dist = 'uniform'
      time_stretch_min = 0.8
      time_stretch_max = 1.2


      print('Generating soundscape: ')
      duration=40.0
      # creación del scaper
      sc = scaper.Scaper(duration, fg_folder ,bg_folder)
      sc.protected_labels = []
      sc.ref_db = -50

      # adición de background
      sc.add_background(label=('const', background), 
                          source_file=('choose', []), 
                          source_time=('const', 0))

      for event in myset:
          if event in eventsList:
              eventSet.add(event)
          if event in cutleryList:
              eventSet.add("cutlery")
          if event in baseballList:
              eventSet.add("baseball")
          if event == "person":
              if background == "bedroom":
                  eventSet.add("personSlept")
              else:
                  eventSet.add("person")
      print(eventSet)
      n_events=10
      time=0
      # Adición de los eventos
      if len(eventSet) != 0:
        for _ in range(n_events):
            auxEvent = random.choice(list(eventSet))
            sc.add_event(label=('const', auxEvent), 
                            source_file=('choose', []), 
                            source_time=(source_time_dist, source_time), 
                            event_time=(event_time_dist, event_time_min, event_time_max), 
                            event_duration=(event_duration_dist, event_duration_min, event_duration_max), 
                            snr=(snr_dist, snr_min, snr_max),
                            pitch_shift=(pitch_dist, pitch_min, pitch_max),
                            time_stretch=(time_stretch_dist, time_stretch_min, time_stretch_max))
            event_time_min += 2

      # Generación de audio
      audiofile = os.path.join(outfolder, "soundResult.wav")
      jamsfile = os.path.join(outfolder, "soundscape.jams")
      txtfile = os.path.join(outfolder, "soundscape.txt")

      sc.generate(audiofile, jamsfile,
                  allow_repeated_label=True,
                  allow_repeated_source=True,
                  reverb=0.1,
                  disable_sox_warnings=True,
                  no_audio=False,
                  txt_path=txtfile)

      # Respuesta a la petición HTTP del audio generado
      self.send_response(200)
      self.send_header("Content-type", "application/octet-stream")
      self.end_headers()
      p = Path(audiofile)
      p.rename(p.with_suffix('.txt'))
      pathResult =  os.path.join(outfolder, "soundResult.txt")
      with open(pathResult, 'rb') as file:
        self.wfile.write(file.read())
      os.remove(pathResult)
    else:
      # Respuesta con el código definido para las imágenes en las que no se detecten objetos
      self.send_response(209)
      self.end_headers()

if __name__ == "__main__":
  ##
  # Configuración y ejecución del servidor HTTP
  #
  os.chmod("./darknet", 711)
  webServer = HTTPServer((hostName, serverPort), MyServer)
  
  print("Server started http://%s:%s" % (hostName, serverPort))

  try:
    webServer.serve_forever()
  except KeyboardInterrupt:
    pass

  webServer.server_close()
  print("Server stopped.")