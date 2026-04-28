# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.js >> WTF LivePulse Command Centre >> TC-04: Anomaly Alerting & Badge Logic
- Location: tests/e2e.spec.js:42:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.animate-subtle-pulse').filter({ hasText: /^\d+$/ })
Expected: visible
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 45000ms
  - waiting for locator('.animate-subtle-pulse').filter({ hasText: /^\d+$/ })

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - banner [ref=e5]:
    - generic [ref=e7]:
      - generic [ref=e8]: WTF LIVEPULSE
      - generic [ref=e9]: 28 Apr, 21:31:25
    - generic [ref=e11]:
      - navigation [ref=e12]:
        - button "Bandra West" [ref=e13] [cursor=pointer]:
          - generic [ref=e14]: Bandra West
        - button "Banjara Hills" [ref=e15] [cursor=pointer]:
          - generic [ref=e16]: Banjara Hills
        - button "Connaught Place" [ref=e17] [cursor=pointer]:
          - generic [ref=e18]: Connaught Place
        - button "Indiranagar" [ref=e19] [cursor=pointer]:
          - generic [ref=e20]: Indiranagar
        - button "Koramangala" [ref=e21] [cursor=pointer]:
          - generic [ref=e22]: Koramangala
        - button "Lajpat Nagar" [ref=e23] [cursor=pointer]:
          - generic [ref=e24]: Lajpat Nagar
        - button "Powai" [ref=e25] [cursor=pointer]:
          - generic [ref=e26]: Powai
        - button "Salt Lake" [ref=e27] [cursor=pointer]:
          - generic [ref=e28]: Salt Lake
        - button "Sector 18 Noida" [ref=e29] [cursor=pointer]:
          - generic [ref=e30]: Sector 18 Noida
        - button "Velachery" [ref=e31] [cursor=pointer]:
          - generic [ref=e32]: Velachery
      - button "arrow_right" [ref=e33] [cursor=pointer]:
        - generic [ref=e34]: arrow_right
    - generic [ref=e35]:
      - generic [ref=e36]:
        - generic [ref=e37]: Fleet Revenue
        - generic [ref=e38]: ₹0.0K Today
      - generic [ref=e39]:
        - button "notifications" [ref=e40] [cursor=pointer]:
          - generic [ref=e41]: notifications
        - button "settings" [ref=e43] [cursor=pointer]:
          - generic [ref=e44]: settings
        - generic [ref=e47] [cursor=pointer]: person
  - main [ref=e48]:
    - generic [ref=e49]:
      - generic [ref=e50]:
        - generic [ref=e51]:
          - heading "Live Occupancy" [level=2] [ref=e54]
          - generic [ref=e56]:
            - generic [ref=e57]: "0"
            - generic [ref=e58]: 0%
          - generic [ref=e61]: "Cap: 300"
        - generic [ref=e62]:
          - heading "Today's Revenue" [level=2] [ref=e64]
          - generic [ref=e65]: ₹0
          - generic [ref=e66]:
            - generic [ref=e67]: "Uplink Latest:"
            - generic [ref=e68]: No cycles recorded
      - generic [ref=e69]:
        - generic [ref=e70]:
          - heading "Footfall Heatmap (7D)" [level=2] [ref=e71]
          - generic [ref=e73]: "Intensity:"
        - generic [ref=e76]:
          - generic [ref=e77]:
            - generic [ref=e78]: 00:00
            - generic [ref=e79]: 06:00
            - generic [ref=e80]: 12:00
            - generic [ref=e81]: 18:00
            - generic [ref=e82]: 23:00
          - generic [ref=e83]:
            - generic [ref=e84]:
              - generic [ref=e85]: SUN
              - generic [ref=e86]:
                - generic: 0 CHECK-INS
              - generic [ref=e87]:
                - generic: 0 CHECK-INS
              - generic [ref=e88]:
                - generic: 0 CHECK-INS
              - generic [ref=e89]:
                - generic: 0 CHECK-INS
              - generic [ref=e90]:
                - generic: 0 CHECK-INS
              - generic [ref=e91]:
                - generic: 0 CHECK-INS
              - generic [ref=e92]:
                - generic: 11 CHECK-INS
              - generic [ref=e93]:
                - generic: 18 CHECK-INS
              - generic [ref=e94]:
                - generic: 22 CHECK-INS
              - generic [ref=e95]:
                - generic: 9 CHECK-INS
              - generic [ref=e96]:
                - generic: 2 CHECK-INS
              - generic [ref=e97]:
                - generic: 0 CHECK-INS
              - generic [ref=e98]:
                - generic: 1 CHECK-INS
              - generic [ref=e99]:
                - generic: 0 CHECK-INS
              - generic [ref=e100]:
                - generic: 2 CHECK-INS
              - generic [ref=e101]:
                - generic: 5 CHECK-INS
              - generic [ref=e102]:
                - generic: 12 CHECK-INS
              - generic [ref=e103]:
                - generic: 17 CHECK-INS
              - generic [ref=e104]:
                - generic: 24 CHECK-INS
              - generic [ref=e105]:
                - generic: 22 CHECK-INS
              - generic [ref=e106]:
                - generic: 12 CHECK-INS
              - generic [ref=e107]:
                - generic: 4 CHECK-INS
              - generic [ref=e108]:
                - generic: 2 CHECK-INS
              - generic [ref=e109]:
                - generic: 0 CHECK-INS
            - generic [ref=e110]:
              - generic [ref=e111]: MON
              - generic [ref=e112]:
                - generic: 0 CHECK-INS
              - generic [ref=e113]:
                - generic: 0 CHECK-INS
              - generic [ref=e114]:
                - generic: 0 CHECK-INS
              - generic [ref=e115]:
                - generic: 0 CHECK-INS
              - generic [ref=e116]:
                - generic: 0 CHECK-INS
              - generic [ref=e117]:
                - generic: 0 CHECK-INS
              - generic [ref=e118]:
                - generic: 32 CHECK-INS
              - generic [ref=e119]:
                - generic: 53 CHECK-INS
              - generic [ref=e120]:
                - generic: 65 CHECK-INS
              - generic [ref=e121]:
                - generic: 27 CHECK-INS
              - generic [ref=e122]:
                - generic: 8 CHECK-INS
              - generic [ref=e123]:
                - generic: 1 CHECK-INS
              - generic [ref=e124]:
                - generic: 1 CHECK-INS
              - generic [ref=e125]:
                - generic: 1 CHECK-INS
              - generic [ref=e126]:
                - generic: 4 CHECK-INS
              - generic [ref=e127]:
                - generic: 15 CHECK-INS
              - generic [ref=e128]:
                - generic: 29 CHECK-INS
              - generic [ref=e129]:
                - generic: 48 CHECK-INS
              - generic [ref=e130]:
                - generic: 48 CHECK-INS
              - generic [ref=e131]:
                - generic: 40 CHECK-INS
              - generic [ref=e132]:
                - generic: 34 CHECK-INS
              - generic [ref=e133]:
                - generic: 17 CHECK-INS
              - generic [ref=e134]:
                - generic: 5 CHECK-INS
              - generic [ref=e135]:
                - generic: 0 CHECK-INS
            - generic [ref=e136]:
              - generic [ref=e137]: TUE
              - generic [ref=e138]:
                - generic: 0 CHECK-INS
              - generic [ref=e139]:
                - generic: 0 CHECK-INS
              - generic [ref=e140]:
                - generic: 0 CHECK-INS
              - generic [ref=e141]:
                - generic: 0 CHECK-INS
              - generic [ref=e142]:
                - generic: 0 CHECK-INS
              - generic [ref=e143]:
                - generic: 0 CHECK-INS
              - generic [ref=e144]:
                - generic: 0 CHECK-INS
              - generic [ref=e145]:
                - generic: 0 CHECK-INS
              - generic [ref=e146]:
                - generic: 0 CHECK-INS
              - generic [ref=e147]:
                - generic: 0 CHECK-INS
              - generic [ref=e148]:
                - generic: 0 CHECK-INS
              - generic [ref=e149]:
                - generic: 0 CHECK-INS
              - generic [ref=e150]:
                - generic: 0 CHECK-INS
              - generic [ref=e151]:
                - generic: 0 CHECK-INS
              - generic [ref=e152]:
                - generic: 60 CHECK-INS
              - generic [ref=e153]:
                - generic: 220 CHECK-INS
              - generic [ref=e154]:
                - generic: 35 CHECK-INS
              - generic [ref=e155]:
                - generic: 53 CHECK-INS
              - generic [ref=e156]:
                - generic: 59 CHECK-INS
              - generic [ref=e157]:
                - generic: 55 CHECK-INS
              - generic [ref=e158]:
                - generic: 39 CHECK-INS
              - generic [ref=e159]:
                - generic: 16 CHECK-INS
              - generic [ref=e160]:
                - generic: 6 CHECK-INS
              - generic [ref=e161]:
                - generic: 0 CHECK-INS
            - generic [ref=e162]:
              - generic [ref=e163]: WED
              - generic [ref=e164]:
                - generic: 0 CHECK-INS
              - generic [ref=e165]:
                - generic: 0 CHECK-INS
              - generic [ref=e166]:
                - generic: 0 CHECK-INS
              - generic [ref=e167]:
                - generic: 0 CHECK-INS
              - generic [ref=e168]:
                - generic: 0 CHECK-INS
              - generic [ref=e169]:
                - generic: 0 CHECK-INS
              - generic [ref=e170]:
                - generic: 22 CHECK-INS
              - generic [ref=e171]:
                - generic: 42 CHECK-INS
              - generic [ref=e172]:
                - generic: 46 CHECK-INS
              - generic [ref=e173]:
                - generic: 28 CHECK-INS
              - generic [ref=e174]:
                - generic: 7 CHECK-INS
              - generic [ref=e175]:
                - generic: 1 CHECK-INS
              - generic [ref=e176]:
                - generic: 1 CHECK-INS
              - generic [ref=e177]:
                - generic: 1 CHECK-INS
              - generic [ref=e178]:
                - generic: 4 CHECK-INS
              - generic [ref=e179]:
                - generic: 10 CHECK-INS
              - generic [ref=e180]:
                - generic: 29 CHECK-INS
              - generic [ref=e181]:
                - generic: 42 CHECK-INS
              - generic [ref=e182]:
                - generic: 57 CHECK-INS
              - generic [ref=e183]:
                - generic: 41 CHECK-INS
              - generic [ref=e184]:
                - generic: 32 CHECK-INS
              - generic [ref=e185]:
                - generic: 12 CHECK-INS
              - generic [ref=e186]:
                - generic: 4 CHECK-INS
              - generic [ref=e187]:
                - generic: 0 CHECK-INS
            - generic [ref=e188]:
              - generic [ref=e189]: THU
              - generic [ref=e190]:
                - generic: 0 CHECK-INS
              - generic [ref=e191]:
                - generic: 0 CHECK-INS
              - generic [ref=e192]:
                - generic: 0 CHECK-INS
              - generic [ref=e193]:
                - generic: 0 CHECK-INS
              - generic [ref=e194]:
                - generic: 0 CHECK-INS
              - generic [ref=e195]:
                - generic: 0 CHECK-INS
              - generic [ref=e196]:
                - generic: 24 CHECK-INS
              - generic [ref=e197]:
                - generic: 42 CHECK-INS
              - generic [ref=e198]:
                - generic: 51 CHECK-INS
              - generic [ref=e199]:
                - generic: 24 CHECK-INS
              - generic [ref=e200]:
                - generic: 6 CHECK-INS
              - generic [ref=e201]:
                - generic: 1 CHECK-INS
              - generic [ref=e202]:
                - generic: 1 CHECK-INS
              - generic [ref=e203]:
                - generic: 1 CHECK-INS
              - generic [ref=e204]:
                - generic: 4 CHECK-INS
              - generic [ref=e205]:
                - generic: 10 CHECK-INS
              - generic [ref=e206]:
                - generic: 21 CHECK-INS
              - generic [ref=e207]:
                - generic: 46 CHECK-INS
              - generic [ref=e208]:
                - generic: 39 CHECK-INS
              - generic [ref=e209]:
                - generic: 40 CHECK-INS
              - generic [ref=e210]:
                - generic: 21 CHECK-INS
              - generic [ref=e211]:
                - generic: 10 CHECK-INS
              - generic [ref=e212]:
                - generic: 5 CHECK-INS
              - generic [ref=e213]:
                - generic: 0 CHECK-INS
            - generic [ref=e214]:
              - generic [ref=e215]: FRI
              - generic [ref=e216]:
                - generic: 0 CHECK-INS
              - generic [ref=e217]:
                - generic: 0 CHECK-INS
              - generic [ref=e218]:
                - generic: 0 CHECK-INS
              - generic [ref=e219]:
                - generic: 0 CHECK-INS
              - generic [ref=e220]:
                - generic: 0 CHECK-INS
              - generic [ref=e221]:
                - generic: 0 CHECK-INS
              - generic [ref=e222]:
                - generic: 19 CHECK-INS
              - generic [ref=e223]:
                - generic: 46 CHECK-INS
              - generic [ref=e224]:
                - generic: 44 CHECK-INS
              - generic [ref=e225]:
                - generic: 19 CHECK-INS
              - generic [ref=e226]:
                - generic: 5 CHECK-INS
              - generic [ref=e227]:
                - generic: 1 CHECK-INS
              - generic [ref=e228]:
                - generic: 1 CHECK-INS
              - generic [ref=e229]:
                - generic: 1 CHECK-INS
              - generic [ref=e230]:
                - generic: 4 CHECK-INS
              - generic [ref=e231]:
                - generic: 9 CHECK-INS
              - generic [ref=e232]:
                - generic: 24 CHECK-INS
              - generic [ref=e233]:
                - generic: 32 CHECK-INS
              - generic [ref=e234]:
                - generic: 54 CHECK-INS
              - generic [ref=e235]:
                - generic: 46 CHECK-INS
              - generic [ref=e236]:
                - generic: 22 CHECK-INS
              - generic [ref=e237]:
                - generic: 10 CHECK-INS
              - generic [ref=e238]:
                - generic: 3 CHECK-INS
              - generic [ref=e239]:
                - generic: 0 CHECK-INS
            - generic [ref=e240]:
              - generic [ref=e241]: SAT
              - generic [ref=e242]:
                - generic: 0 CHECK-INS
              - generic [ref=e243]:
                - generic: 0 CHECK-INS
              - generic [ref=e244]:
                - generic: 0 CHECK-INS
              - generic [ref=e245]:
                - generic: 0 CHECK-INS
              - generic [ref=e246]:
                - generic: 0 CHECK-INS
              - generic [ref=e247]:
                - generic: 0 CHECK-INS
              - generic [ref=e248]:
                - generic: 12 CHECK-INS
              - generic [ref=e249]:
                - generic: 30 CHECK-INS
              - generic [ref=e250]:
                - generic: 24 CHECK-INS
              - generic [ref=e251]:
                - generic: 15 CHECK-INS
              - generic [ref=e252]:
                - generic: 4 CHECK-INS
              - generic [ref=e253]:
                - generic: 1 CHECK-INS
              - generic [ref=e254]:
                - generic: 1 CHECK-INS
              - generic [ref=e255]:
                - generic: 1 CHECK-INS
              - generic [ref=e256]:
                - generic: 3 CHECK-INS
              - generic [ref=e257]:
                - generic: 8 CHECK-INS
              - generic [ref=e258]:
                - generic: 15 CHECK-INS
              - generic [ref=e259]:
                - generic: 27 CHECK-INS
              - generic [ref=e260]:
                - generic: 27 CHECK-INS
              - generic [ref=e261]:
                - generic: 28 CHECK-INS
              - generic [ref=e262]:
                - generic: 17 CHECK-INS
              - generic [ref=e263]:
                - generic: 8 CHECK-INS
              - generic [ref=e264]:
                - generic: 2 CHECK-INS
              - generic [ref=e265]:
                - generic: 0 CHECK-INS
    - generic [ref=e266]:
      - generic [ref=e267]:
        - generic [ref=e268]:
          - heading "Uplink Anomalies" [level=2] [ref=e269]
          - generic [ref=e270]: 0 ALERTS ACTIVE
        - generic [ref=e272]:
          - generic [ref=e273]: check_circle
          - generic [ref=e274]: All Systems Nominal
      - generic [ref=e275]:
        - heading "Retention Risk Matrix" [level=2] [ref=e277]
        - table [ref=e279]:
          - rowgroup [ref=e280]:
            - row "Inert Asset Last Uplink Threat Level" [ref=e281]:
              - columnheader "Inert Asset" [ref=e282]
              - columnheader "Last Uplink" [ref=e283]
              - columnheader "Threat Level" [ref=e284]
          - rowgroup [ref=e285]:
            - row "Meena Kumar 81D AGO CRITICAL" [ref=e286]:
              - cell "Meena Kumar" [ref=e287]
              - cell "81D AGO" [ref=e288]
              - cell "CRITICAL" [ref=e289]
            - row "Sonia Menon 79D AGO CRITICAL" [ref=e290]:
              - cell "Sonia Menon" [ref=e291]
              - cell "79D AGO" [ref=e292]
              - cell "CRITICAL" [ref=e293]
            - row "Ankit Naidu 79D AGO CRITICAL" [ref=e294]:
              - cell "Ankit Naidu" [ref=e295]
              - cell "79D AGO" [ref=e296]
              - cell "CRITICAL" [ref=e297]
            - row "Lata Shah 78D AGO CRITICAL" [ref=e298]:
              - cell "Lata Shah" [ref=e299]
              - cell "78D AGO" [ref=e300]
              - cell "CRITICAL" [ref=e301]
            - row "Vinod Nair 77D AGO CRITICAL" [ref=e302]:
              - cell "Vinod Nair" [ref=e303]
              - cell "77D AGO" [ref=e304]
              - cell "CRITICAL" [ref=e305]
            - row "Vivek Desai 75D AGO CRITICAL" [ref=e306]:
              - cell "Vivek Desai" [ref=e307]
              - cell "75D AGO" [ref=e308]
              - cell "CRITICAL" [ref=e309]
            - row "Geeta Shah 75D AGO CRITICAL" [ref=e310]:
              - cell "Geeta Shah" [ref=e311]
              - cell "75D AGO" [ref=e312]
              - cell "CRITICAL" [ref=e313]
            - row "Amit Nair 72D AGO CRITICAL" [ref=e314]:
              - cell "Amit Nair" [ref=e315]
              - cell "72D AGO" [ref=e316]
              - cell "CRITICAL" [ref=e317]
            - row "Arun Desai 71D AGO CRITICAL" [ref=e318]:
              - cell "Arun Desai" [ref=e319]
              - cell "71D AGO" [ref=e320]
              - cell "CRITICAL" [ref=e321]
            - row "Rahul Naidu 66D AGO CRITICAL" [ref=e322]:
              - cell "Rahul Naidu" [ref=e323]
              - cell "66D AGO" [ref=e324]
              - cell "CRITICAL" [ref=e325]
            - row "Rekha Mehta 62D AGO CRITICAL" [ref=e326]:
              - cell "Rekha Mehta" [ref=e327]
              - cell "62D AGO" [ref=e328]
              - cell "CRITICAL" [ref=e329]
            - row "Anjali Shah 61D AGO CRITICAL" [ref=e330]:
              - cell "Anjali Shah" [ref=e331]
              - cell "61D AGO" [ref=e332]
              - cell "CRITICAL" [ref=e333]
            - row "Vikram Kulkarni 58D AGO HIGH" [ref=e334]:
              - cell "Vikram Kulkarni" [ref=e335]
              - cell "58D AGO" [ref=e336]
              - cell "HIGH" [ref=e337]
            - row "Amit Nair 58D AGO HIGH" [ref=e338]:
              - cell "Amit Nair" [ref=e339]
              - cell "58D AGO" [ref=e340]
              - cell "HIGH" [ref=e341]
            - row "Rekha Patel 57D AGO HIGH" [ref=e342]:
              - cell "Rekha Patel" [ref=e343]
              - cell "57D AGO" [ref=e344]
              - cell "HIGH" [ref=e345]
            - row "Nisha Mehta 56D AGO HIGH" [ref=e346]:
              - cell "Nisha Mehta" [ref=e347]
              - cell "56D AGO" [ref=e348]
              - cell "HIGH" [ref=e349]
            - row "Divya Mehta 56D AGO HIGH" [ref=e350]:
              - cell "Divya Mehta" [ref=e351]
              - cell "56D AGO" [ref=e352]
              - cell "HIGH" [ref=e353]
            - row "Vivek Iyer 55D AGO HIGH" [ref=e354]:
              - cell "Vivek Iyer" [ref=e355]
              - cell "55D AGO" [ref=e356]
              - cell "HIGH" [ref=e357]
            - row "Priya Kulkarni 54D AGO HIGH" [ref=e358]:
              - cell "Priya Kulkarni" [ref=e359]
              - cell "54D AGO" [ref=e360]
              - cell "HIGH" [ref=e361]
            - row "Vikram Sharma 53D AGO HIGH" [ref=e362]:
              - cell "Vikram Sharma" [ref=e363]
              - cell "53D AGO" [ref=e364]
              - cell "HIGH" [ref=e365]
            - row "Geeta Patel 52D AGO HIGH" [ref=e366]:
              - cell "Geeta Patel" [ref=e367]
              - cell "52D AGO" [ref=e368]
              - cell "HIGH" [ref=e369]
            - row "Arjun Kadam 51D AGO HIGH" [ref=e370]:
              - cell "Arjun Kadam" [ref=e371]
              - cell "51D AGO" [ref=e372]
              - cell "HIGH" [ref=e373]
            - row "Lata Menon 51D AGO HIGH" [ref=e374]:
              - cell "Lata Menon" [ref=e375]
              - cell "51D AGO" [ref=e376]
              - cell "HIGH" [ref=e377]
            - row "Ankit Gupta 50D AGO HIGH" [ref=e378]:
              - cell "Ankit Gupta" [ref=e379]
              - cell "50D AGO" [ref=e380]
              - cell "HIGH" [ref=e381]
            - row "Kavita Patel 50D AGO HIGH" [ref=e382]:
              - cell "Kavita Patel" [ref=e383]
              - cell "50D AGO" [ref=e384]
              - cell "HIGH" [ref=e385]
            - row "Vikram Shah 50D AGO HIGH" [ref=e386]:
              - cell "Vikram Shah" [ref=e387]
              - cell "50D AGO" [ref=e388]
              - cell "HIGH" [ref=e389]
            - row "Ramesh Singh 49D AGO HIGH" [ref=e390]:
              - cell "Ramesh Singh" [ref=e391]
              - cell "49D AGO" [ref=e392]
              - cell "HIGH" [ref=e393]
            - row "Sonia Shah 49D AGO HIGH" [ref=e394]:
              - cell "Sonia Shah" [ref=e395]
              - cell "49D AGO" [ref=e396]
              - cell "HIGH" [ref=e397]
            - row "Lata Naidu 47D AGO HIGH" [ref=e398]:
              - cell "Lata Naidu" [ref=e399]
              - cell "47D AGO" [ref=e400]
              - cell "HIGH" [ref=e401]
            - row "Rohit Menon 47D AGO HIGH" [ref=e402]:
              - cell "Rohit Menon" [ref=e403]
              - cell "47D AGO" [ref=e404]
              - cell "HIGH" [ref=e405]
            - row "Ankit Sharma 47D AGO HIGH" [ref=e406]:
              - cell "Ankit Sharma" [ref=e407]
              - cell "47D AGO" [ref=e408]
              - cell "HIGH" [ref=e409]
            - row "Rajesh Patil 47D AGO HIGH" [ref=e410]:
              - cell "Rajesh Patil" [ref=e411]
              - cell "47D AGO" [ref=e412]
              - cell "HIGH" [ref=e413]
            - row "Amit Pillai 46D AGO HIGH" [ref=e414]:
              - cell "Amit Pillai" [ref=e415]
              - cell "46D AGO" [ref=e416]
              - cell "HIGH" [ref=e417]
            - row "Sanjay Iyer 46D AGO HIGH" [ref=e418]:
              - cell "Sanjay Iyer" [ref=e419]
              - cell "46D AGO" [ref=e420]
              - cell "HIGH" [ref=e421]
            - row "Shweta Shah 45D AGO HIGH" [ref=e422]:
              - cell "Shweta Shah" [ref=e423]
              - cell "45D AGO" [ref=e424]
              - cell "HIGH" [ref=e425]
            - row "Meena Shinde 45D AGO HIGH" [ref=e426]:
              - cell "Meena Shinde" [ref=e427]
              - cell "45D AGO" [ref=e428]
              - cell "HIGH" [ref=e429]
            - row "Ramesh Nair 45D AGO HIGH" [ref=e430]:
              - cell "Ramesh Nair" [ref=e431]
              - cell "45D AGO" [ref=e432]
              - cell "HIGH" [ref=e433]
      - generic [ref=e434]:
        - generic [ref=e436]:
          - heading "Simulation Engine" [level=2] [ref=e437]
          - generic [ref=e438]:
            - button "Reset" [ref=e439] [cursor=pointer]
            - generic [ref=e440]: STANDBY
        - generic [ref=e441]:
          - button "Initiate Simulation" [ref=e442] [cursor=pointer]
          - generic [ref=e443]:
            - button "fast_rewind" [ref=e444] [cursor=pointer]:
              - generic [ref=e445]: fast_rewind
            - generic [ref=e446]:
              - generic [ref=e447]: 1X
              - generic [ref=e448]: VEL
            - button "fast_forward" [ref=e449] [cursor=pointer]:
              - generic [ref=e450]: fast_forward
    - generic [ref=e452]:
      - generic [ref=e453]:
        - heading "Live Activity Feed" [level=2] [ref=e454]
        - generic [ref=e457]: LIVE
      - generic [ref=e458]:
        - generic [ref=e461]:
          - generic [ref=e462]:
            - generic [ref=e463]: CHECKOUT
            - generic [ref=e464]: 05:36:00
          - generic [ref=e465]: Manish Menon left facility.
        - generic [ref=e468]:
          - generic [ref=e469]:
            - generic [ref=e470]: CHECKOUT
            - generic [ref=e471]: 05:30:00
          - generic [ref=e472]: Arun Joshi left facility.
        - generic [ref=e475]:
          - generic [ref=e476]:
            - generic [ref=e477]: CHECKOUT
            - generic [ref=e478]: 05:15:00
          - generic [ref=e479]: Vivek Patil left facility.
        - generic [ref=e482]:
          - generic [ref=e483]:
            - generic [ref=e484]: CHECKOUT
            - generic [ref=e485]: 05:10:00
          - generic [ref=e486]: Meena Sharma left facility.
        - generic [ref=e489]:
          - generic [ref=e490]:
            - generic [ref=e491]: CHECKOUT
            - generic [ref=e492]: 04:58:00
          - generic [ref=e493]: Manish Kulkarni left facility.
        - generic [ref=e496]:
          - generic [ref=e497]:
            - generic [ref=e498]: CHECKOUT
            - generic [ref=e499]: 04:43:00
          - generic [ref=e500]: Sonia Verma left facility.
        - generic [ref=e503]:
          - generic [ref=e504]:
            - generic [ref=e505]: CHECKOUT
            - generic [ref=e506]: 04:34:00
          - generic [ref=e507]: Neha Nair left facility.
        - generic [ref=e510]:
          - generic [ref=e511]:
            - generic [ref=e512]: CHECKOUT
            - generic [ref=e513]: 04:22:00
          - generic [ref=e514]: Ramesh Verma left facility.
        - generic [ref=e517]:
          - generic [ref=e518]:
            - generic [ref=e519]: CHECKOUT
            - generic [ref=e520]: 04:15:00
          - generic [ref=e521]: Sunita Iyer left facility.
        - generic [ref=e524]:
          - generic [ref=e525]:
            - generic [ref=e526]: CHECKOUT
            - generic [ref=e527]: 04:15:00
          - generic [ref=e528]: Kavita Naidu left facility.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('WTF LivePulse Command Centre', () => {
  4  |   // Ensure a clean slate before each test runs
  5  |   test.beforeEach(async ({ page, request }) => {
  6  |     // Reset backend state for test isolation
  7  |     await request.post('http://localhost:3001/api/simulator/stop');
  8  |     await request.post('http://localhost:3001/api/simulator/reset');
  9  |     
  10 |     // Set simulator speed to 1x at the start of each test
  11 |     await request.post('http://localhost:3001/api/simulator/start', { data: { speed: 1 } });
  12 |     await request.post('http://localhost:3001/api/simulator/stop');
  13 | 
  14 |     // Navigate to the app
  15 |     await page.goto('/');
  16 |   });
  17 | 
  18 |   test('TC-01: Load Dashboard & Navigation', async ({ page }) => {
  19 |     await expect(page.getByText('WTF LIVEPULSE')).toBeVisible();
  20 |     await expect(page.getByRole('button', { name: /Bandra|Banjara|Connaught/i }).first()).toBeVisible();
  21 |   });
  22 | 
  23 |   test('TC-02: Gym Switching & Data Integrity', async ({ page }) => {
  24 |     const occupancyCounter = page.getByTestId('occupancy-counter');
  25 |     await expect(occupancyCounter).toBeVisible();
  26 |     
  27 |     const gymButtons = page.getByRole('button').filter({ hasText: /West|Hills|Place|Nagar/i });
  28 |     if (await gymButtons.count() > 1) {
  29 |       await gymButtons.nth(1).click();
  30 |       await expect(occupancyCounter).toBeVisible();
  31 |     }
  32 |   });
  33 | 
  34 |   test('TC-03: Real-time Feed Propagation', async ({ page }) => {
  35 |     await page.getByRole('button', { name: /Initiate Simulation|START/i }).click();
  36 |     await expect(page.getByRole('heading', { name: /Live Activity Feed/i })).toBeVisible();
  37 |     
  38 |     const eventMarker = page.locator('div').filter({ hasText: /CHECKIN|CHECKOUT|PAYMENT/ }).first();
  39 |     await expect(eventMarker).toBeVisible({ timeout: 20000 });
  40 |   });
  41 | 
  42 |   test('TC-04: Anomaly Alerting & Badge Logic', async ({ page }) => {
  43 |     const badge = page.locator('.animate-subtle-pulse').filter({ hasText: /^\d+$/ });
> 44 |     await expect(badge).toBeVisible({ timeout: 45000 });
     |                         ^ Error: expect(locator).toBeVisible() failed
  45 |     const text = await badge.innerText();
  46 |     expect(parseInt(text)).toBeGreaterThan(0);
  47 |   });
  48 | 
  49 |   test('TC-05: Analytics & Heatmap Visibility', async ({ page }) => {
  50 |     await expect(page.getByText(/Footfall Heatmap/i)).toBeVisible();
  51 |     await expect(page.getByText(/Retention Risk Matrix/i)).toBeVisible();
  52 |     const heatmapGrid = page.locator('.grid-cols-7').first();
  53 |     await expect(heatmapGrid).toBeVisible();
  54 |   });
  55 | 
  56 |   test('TC-06: Operator Controls & Profile Dropdowns', async ({ page }) => {
  57 |     const settingsBtn = page.locator('button').filter({ has: page.locator('span:has-text("settings")') });
  58 |     await settingsBtn.click();
  59 |     await expect(page.getByText(/System Configuration/i)).toBeVisible();
  60 |     
  61 |     const hcToggle = page.getByText(/High Contrast/i);
  62 |     await hcToggle.click();
  63 |     await expect(page.locator('body')).toHaveClass(/high-contrast/);
  64 | 
  65 |     const profileBtn = page.getByTestId('profile-button');
  66 |     await profileBtn.click();
  67 |     await expect(page.getByText(/Operator Admin/i)).toBeVisible();
  68 |   });
  69 | 
  70 |   test('TC-07: Simulator Speed Control (Step Up/Down)', async ({ page }) => {
  71 |     const speedDisplay = page.getByTestId('speed-display');
  72 |     const stepUpBtn = page.locator('button[title="Step Up Velocity"]');
  73 |     const stepDownBtn = page.locator('button[title="Step Down Velocity"]');
  74 |     
  75 |     await expect(speedDisplay).toContainText('1X');
  76 |     
  77 |     await stepUpBtn.click();
  78 |     await expect(speedDisplay).toContainText('5X');
  79 |     await stepUpBtn.click();
  80 |     await expect(speedDisplay).toContainText('10X');
  81 |     
  82 |     await stepDownBtn.click();
  83 |     await expect(speedDisplay).toContainText('5X');
  84 |     await stepDownBtn.click();
  85 |     await expect(speedDisplay).toContainText('1X');
  86 |   });
  87 | });
  88 | 
```