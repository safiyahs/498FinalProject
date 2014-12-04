# -*- coding: utf-8 -*-
# <nbformat>3.0</nbformat>

# <codecell>

import csv, sqlite3

con = sqlite3.connect("query_langs.db")
cur = con.cursor()
cur.execute("create table if not exists t (tag TEXT, year INTEGER, unanswered INTEGER, total INTEGER, PRIMARY KEY(tag, year));")
#cur.execute("CREATE TABLE t (tag TEXT, year INTEGER, unanswered INTEGER, total INTEGER);")

with open('all_languages_stackoverflow_output.csv','rb') as fin: 
    # csv.DictReader uses first line in file for column headings by default
    dr = csv.DictReader(fin) # comma is default delimiter
    to_db = [(i['tag'], i['year'], i['unanswered'], i['total']) for i in dr]

cur.executemany("INSERT OR REPLACE INTO t (tag, year, unanswered, total) VALUES (?, ?, ?, ?);", to_db)
con.commit()

year_list = [2008, 2009, 2010, 2011, 2012, 2013, 2014]

for year in year_list:
    result = cur.execute('SELECT * FROM t WHERE total != 0 and year = ? order by total DESC limit 10', (year,))
    #cur.execute("SELECT * FROM t where total != 0 and year = 2008 order by total DESC limit 10")
    rows = cur.fetchall()
    
    with open(str(year) + "_top_lang.csv", "wb") as csv_file:
        csv_writer = csv.writer(csv_file)
        csv_writer.writerow([i[0] for i in cur.description]) # write headers
        for r in rows:
            csv_writer.writerow(r)
        csv_writer.writerows(cur)

# close connection
con.close()

# <codecell>


