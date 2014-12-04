# -*- coding: utf-8 -*-
# <nbformat>3.0</nbformat>

# <codecell>

import pandas as pd
import numpy as np
import csv

languages = pd.read_csv('all_languages_stackoverflow_output.csv')
sub_languages = languages[languages.total != 0]

sub_languages.to_csv()

# <codecell>


